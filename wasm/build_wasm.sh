#!/bin/bash
# Build WASM module using Emscripten

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILD_DIR="$SCRIPT_DIR/../build/wasm"

mkdir -p "$BUILD_DIR"

echo "Building Kolibri WASM module..."

# Compile core and chain to WASM
emcc \
    -O2 \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS='["_kolibri_init","_kolibri_destroy","_kolibri_formula_create","_kolibri_formula_get","_kolibri_formula_update","_kolibri_formula_delete","_kolibri_formula_list","_kolibri_formula_execute","_kolibri_formula_mutate","_kolibri_formula_crossover","_kolibri_storage_export","_kolibri_storage_import","_kolibri_get_metrics","_kolibri_sign_formula","_kolibri_verify_formula","_chain_init","_chain_destroy","_chain_create_block","_chain_add_block","_chain_get_block","_chain_get_latest_block","_chain_verify_block","_chain_get_info","_chain_export","_chain_import","_malloc","_free"]' \
    -s EXPORTED_RUNTIME_METHODS='["cwrap","ccall","getValue","setValue"]' \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s INITIAL_MEMORY=16777216 \
    -s MODULARIZE=1 \
    -s EXPORT_NAME='KolibriCore' \
    -I"$SCRIPT_DIR/../core/include" \
    -I"$SCRIPT_DIR/../chain/include" \
    "$SCRIPT_DIR/../core/src/kolibri_core.c" \
    "$SCRIPT_DIR/../chain/src/kolibri_chain.c" \
    -o "$BUILD_DIR/kolibri.js"

echo "WASM build complete: $BUILD_DIR/kolibri.js"
echo "WASM module: $BUILD_DIR/kolibri.wasm"
ls -lh "$BUILD_DIR/kolibri.wasm"
