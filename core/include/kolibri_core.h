/**
 * KOLIBRI.AI Core - Formula-based Knowledge System
 * Fractal-Decimal Kernel with 0-9 roles
 */

#ifndef KOLIBRI_CORE_H
#define KOLIBRI_CORE_H

#include <stdint.h>
#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Version */
#define KOLIBRI_VERSION_MAJOR 1
#define KOLIBRI_VERSION_MINOR 0
#define KOLIBRI_VERSION_PATCH 0

/* Constants */
#define KOLIBRI_MAX_FORMULA_SIZE 4096
#define KOLIBRI_MAX_INPUTS 16
#define KOLIBRI_MAX_OUTPUTS 16
#define KOLIBRI_MAX_TAGS 32
#define KOLIBRI_MAX_PROVENANCES 8
#define KOLIBRI_SIGNATURE_SIZE 64
#define KOLIBRI_ID_SIZE 32

/* Formula structure */
typedef struct {
    uint8_t id[KOLIBRI_ID_SIZE];
    uint32_t version;
    char inputs[KOLIBRI_MAX_INPUTS][64];
    uint8_t input_count;
    char outputs[KOLIBRI_MAX_OUTPUTS][64];
    uint8_t output_count;
    uint8_t* code;
    uint32_t code_size;
    uint32_t cost;
    float fitness;
    uint8_t provenances[KOLIBRI_MAX_PROVENANCES][KOLIBRI_ID_SIZE];
    uint8_t provenance_count;
    uint8_t signature[KOLIBRI_SIGNATURE_SIZE];
    char tags[KOLIBRI_MAX_TAGS][32];
    uint8_t tag_count;
    uint64_t timestamp;
} kolibri_formula_t;

/* Kernel roles (0-9) */
typedef enum {
    ROLE_ARBITER = 0,      /* Decision/Aggregation */
    ROLE_PERCEPTION = 1,   /* Tokenization/Signals */
    ROLE_ACTIVE_MEM = 2,   /* Formula cache */
    ROLE_LONGTERM_MEM = 3, /* Persistent storage */
    ROLE_ANALYTICS = 4,    /* Pattern matching */
    ROLE_MUTATION = 5,     /* Formula generation */
    ROLE_EXECUTION = 6,    /* Sandbox runtime */
    ROLE_GOALS = 7,        /* Rules/Policies */
    ROLE_FEDERATION = 8,   /* Node communication */
    ROLE_AUDIT = 9         /* Integrity/Signatures */
} kolibri_role_t;

/* Core context */
typedef struct kolibri_core_t kolibri_core_t;

/* Initialization */
kolibri_core_t* kolibri_init(const char* storage_path);
void kolibri_destroy(kolibri_core_t* core);

/* Formula operations */
int kolibri_formula_create(kolibri_core_t* core, const kolibri_formula_t* formula);
int kolibri_formula_get(kolibri_core_t* core, const uint8_t* id, kolibri_formula_t* formula);
int kolibri_formula_update(kolibri_core_t* core, const kolibri_formula_t* formula);
int kolibri_formula_delete(kolibri_core_t* core, const uint8_t* id);
int kolibri_formula_list(kolibri_core_t* core, kolibri_formula_t** formulas, uint32_t* count);

/* Formula execution */
typedef struct {
    void* data;
    size_t size;
    uint8_t type; /* 0=int, 1=float, 2=string, 3=binary */
} kolibri_value_t;

int kolibri_formula_execute(kolibri_core_t* core, const uint8_t* formula_id, 
                            const kolibri_value_t* inputs, uint32_t input_count,
                            kolibri_value_t* outputs, uint32_t* output_count);

/* Formula mutation */
int kolibri_formula_mutate(kolibri_core_t* core, const uint8_t* parent_id, 
                          kolibri_formula_t* child);
int kolibri_formula_crossover(kolibri_core_t* core, const uint8_t* parent1_id,
                              const uint8_t* parent2_id, kolibri_formula_t* child);

/* Storage operations */
int kolibri_storage_export(kolibri_core_t* core, const char* path);
int kolibri_storage_import(kolibri_core_t* core, const char* path);

/* Metrics */
typedef struct {
    uint64_t formula_count;
    uint64_t execution_count;
    uint64_t mutation_count;
    uint64_t memory_used;
    float avg_fitness;
} kolibri_metrics_t;

int kolibri_get_metrics(kolibri_core_t* core, kolibri_metrics_t* metrics);

/* Signature operations */
int kolibri_sign_formula(kolibri_formula_t* formula, const uint8_t* private_key);
int kolibri_verify_formula(const kolibri_formula_t* formula, const uint8_t* public_key);

/* Error codes */
#define KOLIBRI_OK 0
#define KOLIBRI_ERROR -1
#define KOLIBRI_ERROR_INVALID_PARAM -2
#define KOLIBRI_ERROR_NOT_FOUND -3
#define KOLIBRI_ERROR_STORAGE -4
#define KOLIBRI_ERROR_EXECUTION -5
#define KOLIBRI_ERROR_SIGNATURE -6

#ifdef __cplusplus
}
#endif

#endif /* KOLIBRI_CORE_H */
