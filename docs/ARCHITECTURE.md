# KOLIBRI.AI - Architecture Documentation

## Overview

KOLIBRI.AI is an offline-first knowledge system based on executable formulas rather than neural network weights. It implements a fractal-decimal kernel with 10 roles (0-9) and includes a micro-blockchain for integrity and federation.

## Core Principles

1. **Formula-based Knowledge**: Knowledge is stored as short executable formulas, not neural weights
2. **Fractal-Decimal Kernel**: 10 digital particles (0-9) each with specific roles
3. **Offline-First**: Complete local operation without external dependencies
4. **Energy Efficient**: Minimal memory footprint (MVP ≤10 MB, target ≤6.5 MB)
5. **Micro-blockchain**: Integrity and consensus without heavy infrastructure

## Architecture Layers

### 1. Core (C/C++)

Location: `/core`

The core layer implements:
- Formula structure and storage
- Key-value storage system
- Formula execution sandbox
- Mutation and crossover operations
- Metrics tracking

**Key Files:**
- `core/include/kolibri_core.h` - Public C API
- `core/src/kolibri_core.c` - Core implementation

**Data Structures:**

```c
typedef struct {
    uint8_t id[32];              // Unique formula ID
    uint32_t version;            // Version number
    char inputs[16][64];         // Input parameters
    uint8_t input_count;
    char outputs[16][64];        // Output parameters
    uint8_t output_count;
    uint8_t* code;               // Formula bytecode
    uint32_t code_size;
    uint32_t cost;               // Execution cost
    float fitness;               // Quality metric
    uint8_t provenances[8][32];  // Parent formulas
    uint8_t provenance_count;
    uint8_t signature[64];       // Ed25519 signature
    char tags[32][32];           // Classification tags
    uint8_t tag_count;
    uint64_t timestamp;
} kolibri_formula_t;
```

### 2. Micro-blockchain (KolibriChain)

Location: `/chain`

Implements lightweight blockchain for:
- Formula integrity verification
- Provenance tracking
- Federation between nodes (future)
- Audit trail

**Block Structure:**

```c
typedef struct {
    uint8_t prev_hash[32];
    uint8_t merkle_root[32];
    uint8_t author_pub[32];
    uint64_t timestamp;
    uint32_t block_number;
    uint8_t formula_ids[100][32];
    uint32_t formula_count;
    uint8_t signature[64];
} kolibri_block_t;
```

### 3. WASM Layer

Location: `/wasm`

Bridges C/C++ core to JavaScript:
- Emscripten compilation
- JavaScript bindings
- Worker pool management
- SharedArrayBuffer for parallel processing

**Key Files:**
- `wasm/build_wasm.sh` - Build script
- `wasm/bridge/kolibri-bridge.js` - JS interface

### 4. PWA (Progressive Web App)

Location: `/pwa`

React-based frontend providing:
- Offline-first operation (Service Worker)
- IndexedDB storage (Dexie)
- Formula graph visualization
- Kernel panel (0-9 roles)
- Cluster management
- Rule tiers configuration
- Import/Export with drag & drop
- Theme support (light/dark/custom)

**Components:**
- `Dashboard` - Metrics and overview
- `FormulaGraph` - Visual graph of formulas
- `KernelPanel` - 0-9 role management
- `ClusterManager` - Worker pool control
- `RuleTiers` - Policy configuration
- `ImportExport` - Data transfer

## Fractal-Decimal Kernel (0-9)

### Role 0: Arbiter/Decision
- Final aggregation of votes
- Policy enforcement
- Resource budget control
- Formula selection

### Role 1: Perception
- Tokenization
- Signal normalization
- Dictionary → code mapping

### Role 2: Active Memory
- Formula cache
- Recent context
- Selection heuristics

### Role 3: Long-term Memory
- Persistent storage
- Formula database
- Metrics history

### Role 4: Analytics/Comparison
- Pattern matching
- Fitness evaluation
- Quality assessment

### Role 5: Generative Mutation
- New formula generation
- Crossover operations
- Variation creation

### Role 6: Execution/Scheduler
- Sandbox runtime
- Resource accounting
- Security enforcement

### Role 7: Goals/Rules
- Policy management
- Priority levels
- Energy conservation modes

### Role 8: Communication/Federation
- Node-to-node exchange
- Knowledge pack transfer
- Export/Import

### Role 9: Audit/Integrity
- Signature verification
- Micro-block creation
- Hash traces
- Recovery operations

## Data Flow

```
User Input → Perception (1) → Active Memory (2)
                ↓
         Analytics (4) → Execution (6)
                ↓
         Mutation (5) → Long-term Memory (3)
                ↓
         Audit (9) → Chain Storage
```

## Security Model

1. **Sandbox Execution**: Formulas run in isolated environment
2. **Resource Limits**: Time, memory, and CPU budgets per formula
3. **Signature Verification**: Ed25519 for formula authenticity
4. **Local-Only**: No external API calls by default
5. **Optional Encryption**: User-key encrypted local database

## Performance Targets

- PWA Start: ≤2s on average laptops
- Time to Interactive: ≤3s
- Core Init: ≤150ms
- Cluster Start: ≤500ms
- Memory per Worker: ≤64MB @ 10k formulas
- Artifact Size: ≤40MB total, core ≤10MB (target ≤6.5MB)

## Storage

### IndexedDB (Frontend)
- Formulas table
- Blocks table
- Metrics table
- Settings table

### File System (Core)
- `.kform` - Single formula file
- `.kpack` - Formula package with metadata
- Chain blocks in binary format

## Build System

```makefile
make core       # Build native core
make wasm       # Build WASM (requires Emscripten)
make frontend   # Build PWA
make test       # Run all tests
make pack       # Create release archive
make clean      # Clean build artifacts
```

## Deployment

1. Build all components: `make all`
2. Package release: `make pack`
3. Extract `dist/kolibri_ready_v1.zip`
4. Serve `/web` directory with any static server
5. Or open `web/index.html` directly (file://)

## Offline Operation

The system works completely offline after initial load:
1. Service Worker caches all assets
2. IndexedDB stores all formulas and state
3. WASM runs entirely in browser
4. No network requests required

## Federation (Future)

When connecting to other nodes:
1. Export `.kpack` with signatures
2. Transfer via any means (USB, local network, etc.)
3. Import on other node
4. Merkle tree merge resolves conflicts
5. Fitness dominance for duplicate formulas
