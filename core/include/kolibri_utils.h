/**
 * KOLIBRI.AI Shared Utilities
 * Common functions used across core and chain modules
 */

#ifndef KOLIBRI_UTILS_H
#define KOLIBRI_UTILS_H

#include <stdint.h>
#include <stddef.h>

/* Hash size constant */
#define KOLIBRI_HASH_SIZE 32

/* Simple hash function (production should use SHA-256) */
void kolibri_hash(const void* data, size_t len, uint8_t* hash);

/* ID operations */
void kolibri_generate_id(uint8_t* id, size_t size);
int kolibri_id_equals(const uint8_t* id1, const uint8_t* id2, size_t size);

/* File I/O helpers */
int kolibri_write_header(void* file, uint32_t magic, uint32_t count);
int kolibri_read_header(void* file, uint32_t expected_magic, uint32_t* count);

/* Signature operations (simplified - production should use ed25519) */
void kolibri_sign_data(const uint8_t* data, size_t data_size, 
                       const uint8_t* private_key, uint8_t* signature, size_t sig_size);
int kolibri_verify_signature(const uint8_t* data, size_t data_size,
                             const uint8_t* public_key, const uint8_t* signature, size_t sig_size);

#endif /* KOLIBRI_UTILS_H */
