#!/bin/bash
# Package KOLIBRI.AI release

set -e

VERSION="1.0.0"
PACKAGE_NAME="kolibri_ready_v1"
DIST_DIR="dist"
BUILD_DIR="build"

echo "🎁 Packaging KOLIBRI.AI v${VERSION}..."

# Create directory structure
mkdir -p "${DIST_DIR}/${PACKAGE_NAME}"/{bin,web,docs,examples}

echo "📦 Copying binaries..."
if [ -d "${BUILD_DIR}/core" ]; then
    cp -r "${BUILD_DIR}/core"/*.a "${DIST_DIR}/${PACKAGE_NAME}/bin/" 2>/dev/null || true
    echo "  ✓ Core library"
fi

if [ -d "${BUILD_DIR}/wasm" ]; then
    cp "${BUILD_DIR}/wasm"/*.wasm "${DIST_DIR}/${PACKAGE_NAME}/bin/" 2>/dev/null || true
    cp "${BUILD_DIR}/wasm"/*.js "${DIST_DIR}/${PACKAGE_NAME}/bin/" 2>/dev/null || true
    echo "  ✓ WASM module"
fi

echo "🌐 Copying web files..."
if [ -d "pwa/build" ]; then
    cp -r pwa/build/* "${DIST_DIR}/${PACKAGE_NAME}/web/"
    echo "  ✓ PWA frontend"
fi

echo "📚 Copying documentation..."
cp docs/*.md "${DIST_DIR}/${PACKAGE_NAME}/docs/" 2>/dev/null || true
cp README.md "${DIST_DIR}/${PACKAGE_NAME}/" 2>/dev/null || true
echo "  ✓ Documentation"

echo "📝 Creating metadata..."
cat > "${DIST_DIR}/${PACKAGE_NAME}/VERSION" <<EOF
KOLIBRI.AI Release
Version: ${VERSION}
Build Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")
Build Host: $(hostname)
EOF

cat > "${DIST_DIR}/${PACKAGE_NAME}/INSTALL.txt" <<EOF
KOLIBRI.AI Installation Instructions

1. Extract this archive
2. For local use:
   - Open web/index.html in your browser
   
3. For server deployment:
   - Serve the 'web' directory with any static server
   - Example: python3 -m http.server 8080
   - Visit http://localhost:8080

4. For development:
   - See docs/BUILD.md

The system works completely offline after initial load.
No internet connection required.

For documentation, see docs/ directory.
EOF

echo "📦 Creating archive..."
cd "${DIST_DIR}"
zip -r "${PACKAGE_NAME}.zip" "${PACKAGE_NAME}" -q

echo "✅ Package created: ${DIST_DIR}/${PACKAGE_NAME}.zip"
ls -lh "${PACKAGE_NAME}.zip"

# Calculate checksums
echo "🔐 Calculating checksums..."
sha256sum "${PACKAGE_NAME}.zip" > "${PACKAGE_NAME}.zip.sha256"
echo "  ✓ SHA256: $(cat ${PACKAGE_NAME}.zip.sha256)"

echo "✨ Packaging complete!"
