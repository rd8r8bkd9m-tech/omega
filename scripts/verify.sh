#!/bin/bash
# Verify KOLIBRI.AI package signatures

set -e

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <file_to_verify> [public_key]"
    echo "Verifies a .kpack or .kform file signature"
    exit 1
fi

FILE="$1"
SIG="${FILE}.sig"
KEY="${2:-~/.kolibri/public.key}"

if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE"
    exit 1
fi

if [ ! -f "$SIG" ]; then
    echo "Error: Signature file not found: $SIG"
    exit 1
fi

echo "🔍 Verifying signature for: $FILE"

# Calculate hash
HASH=$(sha256sum "$FILE" | cut -d' ' -f1)
EXPECTED=$(cat "$SIG")

echo "  Calculated: $HASH"
echo "  Expected:   $EXPECTED"

if [ "$HASH" = "$EXPECTED" ]; then
    echo "✅ Signature valid"
    exit 0
else
    echo "❌ Signature invalid!"
    exit 1
fi
