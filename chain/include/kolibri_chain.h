/**
 * KolibriChain - Micro-blockchain for knowledge integrity
 */

#ifndef KOLIBRI_CHAIN_H
#define KOLIBRI_CHAIN_H

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

#define CHAIN_HASH_SIZE 32
#define CHAIN_PUBKEY_SIZE 32
#define CHAIN_SIGNATURE_SIZE 64
#define CHAIN_MAX_FORMULAS_PER_BLOCK 100

/* Block structure */
typedef struct {
    uint8_t prev_hash[CHAIN_HASH_SIZE];
    uint8_t merkle_root[CHAIN_HASH_SIZE];
    uint8_t author_pub[CHAIN_PUBKEY_SIZE];
    uint64_t timestamp;
    uint32_t block_number;
    uint8_t formula_ids[CHAIN_MAX_FORMULAS_PER_BLOCK][32];
    uint32_t formula_count;
    uint8_t signature[CHAIN_SIGNATURE_SIZE];
} kolibri_block_t;

/* Chain context */
typedef struct kolibri_chain_t kolibri_chain_t;

/* Initialize chain */
kolibri_chain_t* chain_init(const char* storage_path);
void chain_destroy(kolibri_chain_t* chain);

/* Block operations */
int chain_create_block(kolibri_chain_t* chain, const uint8_t* author_private_key,
                      const uint8_t formula_ids[][32], uint32_t formula_count,
                      kolibri_block_t* block);
int chain_add_block(kolibri_chain_t* chain, const kolibri_block_t* block);
int chain_get_block(kolibri_chain_t* chain, uint32_t block_number, kolibri_block_t* block);
int chain_get_latest_block(kolibri_chain_t* chain, kolibri_block_t* block);
int chain_verify_block(kolibri_chain_t* chain, const kolibri_block_t* block);

/* Chain info */
typedef struct {
    uint32_t block_count;
    uint64_t total_formulas;
    uint8_t latest_hash[CHAIN_HASH_SIZE];
} chain_info_t;

int chain_get_info(kolibri_chain_t* chain, chain_info_t* info);

/* Export/Import chain */
int chain_export(kolibri_chain_t* chain, const char* path);
int chain_import(kolibri_chain_t* chain, const char* path);

/* Error codes */
#define CHAIN_OK 0
#define CHAIN_ERROR -1
#define CHAIN_ERROR_INVALID_PARAM -2
#define CHAIN_ERROR_NOT_FOUND -3
#define CHAIN_ERROR_VERIFICATION -4

#ifdef __cplusplus
}
#endif

#endif /* KOLIBRI_CHAIN_H */
