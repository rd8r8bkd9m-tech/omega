/**
 * KOLIBRI.AI Core Implementation
 */

#include "kolibri_core.h"
#include "kolibri_utils.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <time.h>

/* Simple key-value storage structure */
typedef struct kv_entry_t {
    uint8_t key[KOLIBRI_ID_SIZE];
    void* value;
    size_t value_size;
    struct kv_entry_t* next;
} kv_entry_t;

/* Core context structure */
struct kolibri_core_t {
    char storage_path[256];
    kv_entry_t* storage_head;
    kolibri_metrics_t metrics;
    uint32_t formula_capacity;
};

/* Helper: Generate ID from timestamp and random */
static void generate_id(uint8_t* id) {
    kolibri_generate_id(id, KOLIBRI_ID_SIZE);
}

/* Helper: Compare IDs */
static int id_equals(const uint8_t* id1, const uint8_t* id2) {
    return kolibri_id_equals(id1, id2, KOLIBRI_ID_SIZE);
}

/* Initialize core */
kolibri_core_t* kolibri_init(const char* storage_path) {
    kolibri_core_t* core = (kolibri_core_t*)calloc(1, sizeof(kolibri_core_t));
    if (!core) return NULL;
    
    if (storage_path) {
        strncpy(core->storage_path, storage_path, sizeof(core->storage_path) - 1);
    }
    
    core->storage_head = NULL;
    core->formula_capacity = 10000;
    memset(&core->metrics, 0, sizeof(core->metrics));
    
    srand((unsigned int)time(NULL));
    
    return core;
}

/* Destroy core */
void kolibri_destroy(kolibri_core_t* core) {
    if (!core) return;
    
    kv_entry_t* entry = core->storage_head;
    while (entry) {
        kv_entry_t* next = entry->next;
        if (entry->value) free(entry->value);
        free(entry);
        entry = next;
    }
    
    free(core);
}

/* Store formula in key-value storage */
static int kv_put(kolibri_core_t* core, const uint8_t* key, const void* value, size_t value_size) {
    /* Check if key exists */
    kv_entry_t* entry = core->storage_head;
    while (entry) {
        if (id_equals(entry->key, key)) {
            /* Update existing */
            free(entry->value);
            entry->value = malloc(value_size);
            if (!entry->value) return KOLIBRI_ERROR_STORAGE;
            memcpy(entry->value, value, value_size);
            entry->value_size = value_size;
            return KOLIBRI_OK;
        }
        entry = entry->next;
    }
    
    /* Create new entry */
    kv_entry_t* new_entry = (kv_entry_t*)malloc(sizeof(kv_entry_t));
    if (!new_entry) return KOLIBRI_ERROR_STORAGE;
    
    memcpy(new_entry->key, key, KOLIBRI_ID_SIZE);
    new_entry->value = malloc(value_size);
    if (!new_entry->value) {
        free(new_entry);
        return KOLIBRI_ERROR_STORAGE;
    }
    memcpy(new_entry->value, value, value_size);
    new_entry->value_size = value_size;
    new_entry->next = core->storage_head;
    core->storage_head = new_entry;
    
    return KOLIBRI_OK;
}

/* Get formula from key-value storage */
static int kv_get(kolibri_core_t* core, const uint8_t* key, void* value, size_t* value_size) {
    kv_entry_t* entry = core->storage_head;
    while (entry) {
        if (id_equals(entry->key, key)) {
            if (value && value_size) {
                size_t copy_size = *value_size < entry->value_size ? *value_size : entry->value_size;
                memcpy(value, entry->value, copy_size);
                *value_size = entry->value_size;
            }
            return KOLIBRI_OK;
        }
        entry = entry->next;
    }
    return KOLIBRI_ERROR_NOT_FOUND;
}

/* Delete formula from key-value storage */
static int kv_delete(kolibri_core_t* core, const uint8_t* key) {
    kv_entry_t** entry_ptr = &core->storage_head;
    while (*entry_ptr) {
        if (id_equals((*entry_ptr)->key, key)) {
            kv_entry_t* to_delete = *entry_ptr;
            *entry_ptr = to_delete->next;
            free(to_delete->value);
            free(to_delete);
            return KOLIBRI_OK;
        }
        entry_ptr = &(*entry_ptr)->next;
    }
    return KOLIBRI_ERROR_NOT_FOUND;
}

/* Create formula */
int kolibri_formula_create(kolibri_core_t* core, const kolibri_formula_t* formula) {
    if (!core || !formula) return KOLIBRI_ERROR_INVALID_PARAM;
    
    /* Check if ID is zero (generate new) */
    kolibri_formula_t new_formula = *formula;
    int is_zero = 1;
    for (int i = 0; i < KOLIBRI_ID_SIZE; i++) {
        if (new_formula.id[i] != 0) {
            is_zero = 0;
            break;
        }
    }
    if (is_zero) {
        generate_id(new_formula.id);
    }
    
    new_formula.timestamp = (uint64_t)time(NULL);
    
    int result = kv_put(core, new_formula.id, &new_formula, sizeof(kolibri_formula_t));
    if (result == KOLIBRI_OK) {
        core->metrics.formula_count++;
    }
    
    return result;
}

/* Get formula */
int kolibri_formula_get(kolibri_core_t* core, const uint8_t* id, kolibri_formula_t* formula) {
    if (!core || !id || !formula) return KOLIBRI_ERROR_INVALID_PARAM;
    
    size_t size = sizeof(kolibri_formula_t);
    return kv_get(core, id, formula, &size);
}

/* Update formula */
int kolibri_formula_update(kolibri_core_t* core, const kolibri_formula_t* formula) {
    if (!core || !formula) return KOLIBRI_ERROR_INVALID_PARAM;
    
    kolibri_formula_t updated = *formula;
    updated.timestamp = (uint64_t)time(NULL);
    
    return kv_put(core, updated.id, &updated, sizeof(kolibri_formula_t));
}

/* Delete formula */
int kolibri_formula_delete(kolibri_core_t* core, const uint8_t* id) {
    if (!core || !id) return KOLIBRI_ERROR_INVALID_PARAM;
    
    int result = kv_delete(core, id);
    if (result == KOLIBRI_OK) {
        if (core->metrics.formula_count > 0) {
            core->metrics.formula_count--;
        }
    }
    
    return result;
}

/* List formulas */
int kolibri_formula_list(kolibri_core_t* core, kolibri_formula_t** formulas, uint32_t* count) {
    if (!core || !count) return KOLIBRI_ERROR_INVALID_PARAM;
    
    /* Count entries */
    uint32_t entry_count = 0;
    kv_entry_t* entry = core->storage_head;
    while (entry) {
        entry_count++;
        entry = entry->next;
    }
    
    if (entry_count == 0) {
        *count = 0;
        *formulas = NULL;
        return KOLIBRI_OK;
    }
    
    /* Allocate array */
    kolibri_formula_t* result = (kolibri_formula_t*)malloc(sizeof(kolibri_formula_t) * entry_count);
    if (!result) return KOLIBRI_ERROR_STORAGE;
    
    /* Copy formulas */
    entry = core->storage_head;
    uint32_t i = 0;
    while (entry && i < entry_count) {
        memcpy(&result[i], entry->value, sizeof(kolibri_formula_t));
        i++;
        entry = entry->next;
    }
    
    *formulas = result;
    *count = entry_count;
    
    return KOLIBRI_OK;
}

/* Execute formula (simplified sandbox) */
int kolibri_formula_execute(kolibri_core_t* core, const uint8_t* formula_id,
                            const kolibri_value_t* inputs, uint32_t input_count,
                            kolibri_value_t* outputs, uint32_t* output_count) {
    if (!core || !formula_id) return KOLIBRI_ERROR_INVALID_PARAM;
    
    kolibri_formula_t formula;
    int result = kolibri_formula_get(core, formula_id, &formula);
    if (result != KOLIBRI_OK) return result;
    
    /* Basic execution simulation */
    core->metrics.execution_count++;
    
    /* For MVP, just echo inputs to outputs */
    if (outputs && output_count) {
        uint32_t copy_count = input_count < *output_count ? input_count : *output_count;
        for (uint32_t i = 0; i < copy_count; i++) {
            outputs[i] = inputs[i];
        }
        *output_count = copy_count;
    }
    
    return KOLIBRI_OK;
}

/* Mutate formula */
int kolibri_formula_mutate(kolibri_core_t* core, const uint8_t* parent_id,
                          kolibri_formula_t* child) {
    if (!core || !parent_id || !child) return KOLIBRI_ERROR_INVALID_PARAM;
    
    kolibri_formula_t parent;
    int result = kolibri_formula_get(core, parent_id, &parent);
    if (result != KOLIBRI_OK) return result;
    
    /* Copy parent and generate new ID */
    *child = parent;
    generate_id(child->id);
    child->version = parent.version + 1;
    child->timestamp = (uint64_t)time(NULL);
    
    /* Add parent to provenances */
    if (child->provenance_count < KOLIBRI_MAX_PROVENANCES) {
        memcpy(child->provenances[child->provenance_count], parent_id, KOLIBRI_ID_SIZE);
        child->provenance_count++;
    }
    
    /* Simple mutation: adjust fitness slightly */
    child->fitness = parent.fitness * (0.95f + (rand() % 100) / 1000.0f);
    
    core->metrics.mutation_count++;
    
    return KOLIBRI_OK;
}

/* Crossover formulas */
int kolibri_formula_crossover(kolibri_core_t* core, const uint8_t* parent1_id,
                              const uint8_t* parent2_id, kolibri_formula_t* child) {
    if (!core || !parent1_id || !parent2_id || !child) return KOLIBRI_ERROR_INVALID_PARAM;
    
    kolibri_formula_t parent1, parent2;
    int result = kolibri_formula_get(core, parent1_id, &parent1);
    if (result != KOLIBRI_OK) return result;
    
    result = kolibri_formula_get(core, parent2_id, &parent2);
    if (result != KOLIBRI_OK) return result;
    
    /* Simple crossover: blend parents */
    *child = parent1;
    generate_id(child->id);
    child->version = (parent1.version + parent2.version) / 2 + 1;
    child->timestamp = (uint64_t)time(NULL);
    
    /* Add both parents to provenances */
    child->provenance_count = 0;
    if (child->provenance_count < KOLIBRI_MAX_PROVENANCES) {
        memcpy(child->provenances[child->provenance_count], parent1_id, KOLIBRI_ID_SIZE);
        child->provenance_count++;
    }
    if (child->provenance_count < KOLIBRI_MAX_PROVENANCES) {
        memcpy(child->provenances[child->provenance_count], parent2_id, KOLIBRI_ID_SIZE);
        child->provenance_count++;
    }
    
    /* Blend fitness */
    child->fitness = (parent1.fitness + parent2.fitness) / 2.0f;
    
    core->metrics.mutation_count++;
    
    return KOLIBRI_OK;
}

/* Export storage */
int kolibri_storage_export(kolibri_core_t* core, const char* path) {
    if (!core || !path) return KOLIBRI_ERROR_INVALID_PARAM;
    
    FILE* f = fopen(path, "wb");
    if (!f) return KOLIBRI_ERROR_STORAGE;
    
    /* Write header */
    uint32_t magic = 0x4B464F52; /* "KFOR" */
    if (kolibri_write_header(f, magic, core->metrics.formula_count) != 0) {
        fclose(f);
        return KOLIBRI_ERROR_STORAGE;
    }
    
    /* Write formulas */
    kv_entry_t* entry = core->storage_head;
    while (entry) {
        fwrite(entry->value, entry->value_size, 1, f);
        entry = entry->next;
    }
    
    fclose(f);
    return KOLIBRI_OK;
}

/* Import storage */
int kolibri_storage_import(kolibri_core_t* core, const char* path) {
    if (!core || !path) return KOLIBRI_ERROR_INVALID_PARAM;
    
    FILE* f = fopen(path, "rb");
    if (!f) return KOLIBRI_ERROR_STORAGE;
    
    /* Read header */
    uint32_t magic = 0x4B464F52; /* "KFOR" */
    uint32_t count;
    if (kolibri_read_header(f, magic, &count) != 0) {
        fclose(f);
        return KOLIBRI_ERROR_STORAGE;
    }
    
    /* Read formulas */
    for (uint32_t i = 0; i < count; i++) {
        kolibri_formula_t formula;
        if (fread(&formula, sizeof(kolibri_formula_t), 1, f) != 1) {
            fclose(f);
            return KOLIBRI_ERROR_STORAGE;
        }
        kolibri_formula_create(core, &formula);
    }
    
    fclose(f);
    return KOLIBRI_OK;
}

/* Get metrics */
int kolibri_get_metrics(kolibri_core_t* core, kolibri_metrics_t* metrics) {
    if (!core || !metrics) return KOLIBRI_ERROR_INVALID_PARAM;
    
    /* Calculate current metrics */
    core->metrics.memory_used = sizeof(kolibri_core_t);
    
    float total_fitness = 0.0f;
    uint32_t count = 0;
    kv_entry_t* entry = core->storage_head;
    while (entry) {
        core->metrics.memory_used += sizeof(kv_entry_t) + entry->value_size;
        kolibri_formula_t* f = (kolibri_formula_t*)entry->value;
        total_fitness += f->fitness;
        count++;
        entry = entry->next;
    }
    
    if (count > 0) {
        core->metrics.avg_fitness = total_fitness / count;
    }
    
    *metrics = core->metrics;
    return KOLIBRI_OK;
}

/* Signature operations (simplified - would use ed25519 in production) */
int kolibri_sign_formula(kolibri_formula_t* formula, const uint8_t* private_key) {
    if (!formula || !private_key) return KOLIBRI_ERROR_INVALID_PARAM;
    
    /* Sign the formula ID using shared utilities */
    kolibri_sign_data(formula->id, KOLIBRI_ID_SIZE, private_key, 
                     formula->signature, KOLIBRI_SIGNATURE_SIZE);
    
    return KOLIBRI_OK;
}

int kolibri_verify_formula(const kolibri_formula_t* formula, const uint8_t* public_key) {
    if (!formula || !public_key) return KOLIBRI_ERROR_INVALID_PARAM;
    
    /* Verify the signature using shared utilities */
    if (kolibri_verify_signature(formula->id, KOLIBRI_ID_SIZE, public_key,
                                 formula->signature, KOLIBRI_SIGNATURE_SIZE) != 0) {
        return KOLIBRI_ERROR_SIGNATURE;
    }
    
    return KOLIBRI_OK;
}
