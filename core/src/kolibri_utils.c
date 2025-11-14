/**
 * KOLIBRI.AI Shared Utilities Implementation
 */

#include "kolibri_utils.h"
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <stdio.h>

/* Simple hash function (would use SHA-256 in production) */
void kolibri_hash(const void* data, size_t len, uint8_t* hash) {
    memset(hash, 0, KOLIBRI_HASH_SIZE);
    const uint8_t* bytes = (const uint8_t*)data;
    for (size_t i = 0; i < len; i++) {
        hash[i % KOLIBRI_HASH_SIZE] ^= bytes[i];
        hash[(i + 1) % KOLIBRI_HASH_SIZE] = (hash[(i + 1) % KOLIBRI_HASH_SIZE] + bytes[i]) & 0xFF;
    }
}

/* Generate ID from timestamp and random data */
void kolibri_generate_id(uint8_t* id, size_t size) {
    uint64_t ts = (uint64_t)time(NULL);
    size_t ts_size = sizeof(ts) < size ? sizeof(ts) : size;
    memcpy(id, &ts, ts_size);
    for (size_t i = ts_size; i < size; i++) {
        id[i] = (uint8_t)(rand() & 0xFF);
    }
}

/* Compare IDs */
int kolibri_id_equals(const uint8_t* id1, const uint8_t* id2, size_t size) {
    return memcmp(id1, id2, size) == 0;
}

/* Write file header with magic and count */
int kolibri_write_header(void* file, uint32_t magic, uint32_t count) {
    FILE* f = (FILE*)file;
    if (!f) return -1;
    
    if (fwrite(&magic, sizeof(magic), 1, f) != 1) return -1;
    if (fwrite(&count, sizeof(count), 1, f) != 1) return -1;
    
    return 0;
}

/* Read file header and verify magic */
int kolibri_read_header(void* file, uint32_t expected_magic, uint32_t* count) {
    FILE* f = (FILE*)file;
    if (!f || !count) return -1;
    
    uint32_t magic;
    if (fread(&magic, sizeof(magic), 1, f) != 1) return -1;
    if (magic != expected_magic) return -1;
    if (fread(count, sizeof(*count), 1, f) != 1) return -1;
    
    return 0;
}

/* Sign data (simplified - production should use ed25519) */
void kolibri_sign_data(const uint8_t* data, size_t data_size,
                       const uint8_t* private_key, uint8_t* signature, size_t sig_size) {
    /* Simple signature: XOR hash with private key */
    uint8_t hash[KOLIBRI_HASH_SIZE];
    kolibri_hash(data, data_size, hash);
    
    for (size_t i = 0; i < sig_size; i++) {
        signature[i] = (hash[i % KOLIBRI_HASH_SIZE] ^ private_key[i % 32]) & 0xFF;
    }
}

/* Verify signature (simplified - production should use ed25519) */
int kolibri_verify_signature(const uint8_t* data, size_t data_size,
                             const uint8_t* public_key, const uint8_t* signature, size_t sig_size) {
    /* Simple verification: recompute and compare */
    uint8_t hash[KOLIBRI_HASH_SIZE];
    kolibri_hash(data, data_size, hash);
    
    for (size_t i = 0; i < sig_size; i++) {
        uint8_t expected = (hash[i % KOLIBRI_HASH_SIZE] ^ public_key[i % 32]) & 0xFF;
        if (signature[i] != expected) {
            return -1; /* Verification failed */
        }
    }
    
    return 0; /* Verification successful */
}
