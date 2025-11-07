/**
 * KolibriChain Implementation
 */

#include "kolibri_chain.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <time.h>

/* Simple hash function (would use SHA-256 in production) */
static void simple_hash(const void* data, size_t len, uint8_t* hash) {
    memset(hash, 0, CHAIN_HASH_SIZE);
    const uint8_t* bytes = (const uint8_t*)data;
    for (size_t i = 0; i < len; i++) {
        hash[i % CHAIN_HASH_SIZE] ^= bytes[i];
        hash[(i + 1) % CHAIN_HASH_SIZE] = (hash[(i + 1) % CHAIN_HASH_SIZE] + bytes[i]) & 0xFF;
    }
}

/* Block storage */
typedef struct block_entry_t {
    kolibri_block_t block;
    struct block_entry_t* next;
} block_entry_t;

/* Chain context */
struct kolibri_chain_t {
    char storage_path[256];
    block_entry_t* head;
    uint32_t block_count;
};

/* Initialize chain */
kolibri_chain_t* chain_init(const char* storage_path) {
    kolibri_chain_t* chain = (kolibri_chain_t*)calloc(1, sizeof(kolibri_chain_t));
    if (!chain) return NULL;
    
    if (storage_path) {
        strncpy(chain->storage_path, storage_path, sizeof(chain->storage_path) - 1);
    }
    
    /* Create genesis block */
    kolibri_block_t genesis;
    memset(&genesis, 0, sizeof(genesis));
    genesis.timestamp = (uint64_t)time(NULL);
    genesis.block_number = 0;
    
    block_entry_t* entry = (block_entry_t*)malloc(sizeof(block_entry_t));
    if (!entry) {
        free(chain);
        return NULL;
    }
    
    entry->block = genesis;
    entry->next = NULL;
    chain->head = entry;
    chain->block_count = 1;
    
    return chain;
}

/* Destroy chain */
void chain_destroy(kolibri_chain_t* chain) {
    if (!chain) return;
    
    block_entry_t* entry = chain->head;
    while (entry) {
        block_entry_t* next = entry->next;
        free(entry);
        entry = next;
    }
    
    free(chain);
}

/* Calculate merkle root */
static void calculate_merkle_root(const uint8_t formula_ids[][32], uint32_t count,
                                 uint8_t* merkle_root) {
    if (count == 0) {
        memset(merkle_root, 0, CHAIN_HASH_SIZE);
        return;
    }
    
    /* Simple merkle: hash all IDs together */
    simple_hash(formula_ids, count * 32, merkle_root);
}

/* Get latest block */
int chain_get_latest_block(kolibri_chain_t* chain, kolibri_block_t* block) {
    if (!chain || !block) return CHAIN_ERROR_INVALID_PARAM;
    
    if (!chain->head) return CHAIN_ERROR_NOT_FOUND;
    
    *block = chain->head->block;
    return CHAIN_OK;
}

/* Create block */
int chain_create_block(kolibri_chain_t* chain, const uint8_t* author_private_key,
                      const uint8_t formula_ids[][32], uint32_t formula_count,
                      kolibri_block_t* block) {
    if (!chain || !block || formula_count > CHAIN_MAX_FORMULAS_PER_BLOCK) {
        return CHAIN_ERROR_INVALID_PARAM;
    }
    
    /* Get previous block hash */
    kolibri_block_t prev;
    if (chain_get_latest_block(chain, &prev) == CHAIN_OK) {
        simple_hash(&prev, sizeof(kolibri_block_t) - CHAIN_SIGNATURE_SIZE, block->prev_hash);
        block->block_number = prev.block_number + 1;
    } else {
        memset(block->prev_hash, 0, CHAIN_HASH_SIZE);
        block->block_number = 0;
    }
    
    /* Set block data */
    block->timestamp = (uint64_t)time(NULL);
    block->formula_count = formula_count;
    
    if (formula_ids && formula_count > 0) {
        memcpy(block->formula_ids, formula_ids, formula_count * 32);
    }
    
    /* Calculate merkle root */
    calculate_merkle_root(block->formula_ids, formula_count, block->merkle_root);
    
    /* Set author */
    if (author_private_key) {
        /* Derive public key (simplified) */
        for (int i = 0; i < CHAIN_PUBKEY_SIZE; i++) {
            block->author_pub[i] = author_private_key[i] ^ 0xAA;
        }
        
        /* Sign block */
        uint8_t block_hash[CHAIN_HASH_SIZE];
        simple_hash(block, sizeof(kolibri_block_t) - CHAIN_SIGNATURE_SIZE, block_hash);
        
        for (int i = 0; i < CHAIN_SIGNATURE_SIZE; i++) {
            block->signature[i] = (block_hash[i % CHAIN_HASH_SIZE] ^ author_private_key[i % 32]) & 0xFF;
        }
    }
    
    return CHAIN_OK;
}

/* Add block to chain */
int chain_add_block(kolibri_chain_t* chain, const kolibri_block_t* block) {
    if (!chain || !block) return CHAIN_ERROR_INVALID_PARAM;
    
    /* Verify block */
    int result = chain_verify_block(chain, block);
    if (result != CHAIN_OK) return result;
    
    /* Add to chain */
    block_entry_t* entry = (block_entry_t*)malloc(sizeof(block_entry_t));
    if (!entry) return CHAIN_ERROR;
    
    entry->block = *block;
    entry->next = chain->head;
    chain->head = entry;
    chain->block_count++;
    
    return CHAIN_OK;
}

/* Get block by number */
int chain_get_block(kolibri_chain_t* chain, uint32_t block_number, kolibri_block_t* block) {
    if (!chain || !block) return CHAIN_ERROR_INVALID_PARAM;
    
    block_entry_t* entry = chain->head;
    while (entry) {
        if (entry->block.block_number == block_number) {
            *block = entry->block;
            return CHAIN_OK;
        }
        entry = entry->next;
    }
    
    return CHAIN_ERROR_NOT_FOUND;
}

/* Verify block */
int chain_verify_block(kolibri_chain_t* chain, const kolibri_block_t* block) {
    if (!chain || !block) return CHAIN_ERROR_INVALID_PARAM;
    
    /* Verify merkle root */
    uint8_t calculated_merkle[CHAIN_HASH_SIZE];
    calculate_merkle_root(block->formula_ids, block->formula_count, calculated_merkle);
    
    if (memcmp(calculated_merkle, block->merkle_root, CHAIN_HASH_SIZE) != 0) {
        return CHAIN_ERROR_VERIFICATION;
    }
    
    /* Verify previous hash */
    if (block->block_number > 0) {
        kolibri_block_t prev;
        if (chain_get_block(chain, block->block_number - 1, &prev) == CHAIN_OK) {
            uint8_t prev_hash[CHAIN_HASH_SIZE];
            simple_hash(&prev, sizeof(kolibri_block_t) - CHAIN_SIGNATURE_SIZE, prev_hash);
            
            if (memcmp(prev_hash, block->prev_hash, CHAIN_HASH_SIZE) != 0) {
                return CHAIN_ERROR_VERIFICATION;
            }
        }
    }
    
    return CHAIN_OK;
}

/* Get chain info */
int chain_get_info(kolibri_chain_t* chain, chain_info_t* info) {
    if (!chain || !info) return CHAIN_ERROR_INVALID_PARAM;
    
    info->block_count = chain->block_count;
    info->total_formulas = 0;
    
    block_entry_t* entry = chain->head;
    while (entry) {
        info->total_formulas += entry->block.formula_count;
        entry = entry->next;
    }
    
    if (chain->head) {
        simple_hash(&chain->head->block, sizeof(kolibri_block_t) - CHAIN_SIGNATURE_SIZE,
                   info->latest_hash);
    }
    
    return CHAIN_OK;
}

/* Export chain */
int chain_export(kolibri_chain_t* chain, const char* path) {
    if (!chain || !path) return CHAIN_ERROR_INVALID_PARAM;
    
    FILE* f = fopen(path, "wb");
    if (!f) return CHAIN_ERROR;
    
    /* Write header */
    uint32_t magic = 0x4B434841; /* "KCHA" */
    fwrite(&magic, sizeof(magic), 1, f);
    fwrite(&chain->block_count, sizeof(uint32_t), 1, f);
    
    /* Write blocks in reverse order (oldest first) */
    block_entry_t** entries = (block_entry_t**)malloc(sizeof(block_entry_t*) * chain->block_count);
    if (!entries) {
        fclose(f);
        return CHAIN_ERROR;
    }
    
    block_entry_t* entry = chain->head;
    int i = chain->block_count - 1;
    while (entry && i >= 0) {
        entries[i] = entry;
        entry = entry->next;
        i--;
    }
    
    for (uint32_t j = 0; j < chain->block_count; j++) {
        fwrite(&entries[j]->block, sizeof(kolibri_block_t), 1, f);
    }
    
    free(entries);
    fclose(f);
    return CHAIN_OK;
}

/* Import chain */
int chain_import(kolibri_chain_t* chain, const char* path) {
    if (!chain || !path) return CHAIN_ERROR_INVALID_PARAM;
    
    FILE* f = fopen(path, "rb");
    if (!f) return CHAIN_ERROR;
    
    /* Read header */
    uint32_t magic, count;
    fread(&magic, sizeof(magic), 1, f);
    if (magic != 0x4B434841) {
        fclose(f);
        return CHAIN_ERROR;
    }
    fread(&count, sizeof(uint32_t), 1, f);
    
    /* Read blocks */
    for (uint32_t i = 0; i < count; i++) {
        kolibri_block_t block;
        if (fread(&block, sizeof(kolibri_block_t), 1, f) != 1) {
            fclose(f);
            return CHAIN_ERROR;
        }
        
        /* Skip genesis if it already exists */
        if (i == 0 && chain->block_count > 0) continue;
        
        chain_add_block(chain, &block);
    }
    
    fclose(f);
    return CHAIN_OK;
}
