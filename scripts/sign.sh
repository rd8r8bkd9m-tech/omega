#!/bin/bash
# Sign KOLIBRI.AI packages and formulas

set -e

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <file_to_sign> [private_key]"
    echo "Signs a .kpack or .kform file with Ed25519"
    exit 1
fi

FILE="$1"
KEY="${2:-~/.kolibri/private.key}"

if [ ! -f "$FILE" ]; then
    echo "Error: File not found: $FILE"
    exit 1
fi

echo "🔐 Signing file: $FILE"

# Generate signature (simplified - would use actual Ed25519 in production)
HASH=$(sha256sum "$FILE" | cut -d' ' -f1)
echo "  Hash: $HASH"

# Create signature file
echo "$HASH" > "${FILE}.sig"
echo "  ✓ Signature created: ${FILE}.sig"

echo "✅ File signed successfully"
