#!/bin/bash
# Comprehensive verification script for KOLIBRI.AI

set -e

echo "🔍 KOLIBRI.AI Verification Script"
echo "=================================="
echo ""

# Check project structure
echo "📁 Checking project structure..."
for dir in core chain wasm pwa docs scripts assets ci; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir/"
    else
        echo "  ✗ $dir/ MISSING"
        exit 1
    fi
done
echo ""

# Check core files
echo "📄 Checking core files..."
for file in core/include/kolibri_core.h core/src/kolibri_core.c chain/include/kolibri_chain.h chain/src/kolibri_chain.c; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file MISSING"
        exit 1
    fi
done
echo ""

# Check documentation
echo "📚 Checking documentation..."
for doc in docs/ARCHITECTURE.md docs/FORMULA_DSL.md docs/BUILD.md docs/DEMO_SCRIPT.md; do
    if [ -f "$doc" ]; then
        echo "  ✓ $doc"
    else
        echo "  ✗ $doc MISSING"
        exit 1
    fi
done
echo ""

# Build core
echo "🔨 Building core..."
make clean > /dev/null 2>&1 || true
make core > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "  ✓ Core builds successfully"
else
    echo "  ✗ Core build failed"
    exit 1
fi
echo ""

# Check core size
echo "📏 Checking core size..."
CORE_SIZE=$(stat -f%z build/core/libkolibri.a 2>/dev/null || stat -c%s build/core/libkolibri.a)
TARGET_SIZE=6815744  # 6.5 MB in bytes
echo "  Core size: $CORE_SIZE bytes"
echo "  Target: ≤$TARGET_SIZE bytes (6.5 MB)"
if [ $CORE_SIZE -le $TARGET_SIZE ]; then
    PERCENT=$(echo "scale=1; 100 - ($CORE_SIZE * 100 / $TARGET_SIZE)" | bc)
    echo "  ✓ ${PERCENT}% under target!"
else
    echo "  ✗ Exceeds size target"
    exit 1
fi
echo ""

# Check frontend
echo "🌐 Checking frontend..."
if [ -d "pwa/build" ]; then
    echo "  ✓ Frontend build exists"
    FRONTEND_SIZE=$(du -sb pwa/build | cut -f1)
    echo "  Frontend size: $FRONTEND_SIZE bytes"
else
    echo "  ⚠ Frontend not built (run 'make frontend')"
fi
echo ""

# Check package
echo "📦 Checking release package..."
if [ -f "dist/kolibri_ready_v1.zip" ]; then
    echo "  ✓ Release package exists"
    PACKAGE_SIZE=$(stat -f%z dist/kolibri_ready_v1.zip 2>/dev/null || stat -c%s dist/kolibri_ready_v1.zip)
    echo "  Package size: $PACKAGE_SIZE bytes"
    PACKAGE_SIZE_MB=$(echo "scale=2; $PACKAGE_SIZE / 1024 / 1024" | bc)
    echo "  Package size: ${PACKAGE_SIZE_MB} MB"
else
    echo "  ⚠ Release package not created (run 'make pack')"
fi
echo ""

# Check Makefile targets
echo "🎯 Checking Makefile targets..."
for target in core frontend test pack clean; do
    if grep -q "^${target}:" Makefile; then
        echo "  ✓ make $target"
    else
        echo "  ✗ make $target MISSING"
        exit 1
    fi
done
echo ""

# Check scripts
echo "🔧 Checking scripts..."
for script in scripts/pack.sh scripts/sign.sh scripts/verify.sh; do
    if [ -x "$script" ]; then
        echo "  ✓ $script (executable)"
    else
        echo "  ✗ $script (not executable or missing)"
        exit 1
    fi
done
echo ""

# Check CI
echo "🤖 Checking CI configuration..."
if [ -f ".github/workflows/build.yml" ]; then
    echo "  ✓ GitHub Actions workflow configured"
else
    echo "  ✗ CI configuration missing"
    exit 1
fi
echo ""

# Summary
echo "=================================="
echo "✅ All verifications passed!"
echo ""
echo "KOLIBRI.AI is ready for deployment."
echo ""
echo "Quick Start:"
echo "  1. make all          # Build everything"
echo "  2. make dev          # Start development server"
echo "  3. make pack         # Create release package"
echo ""
echo "Documentation: docs/"
echo "Examples: assets/examples/"
echo "Package: dist/kolibri_ready_v1.zip"
echo ""
