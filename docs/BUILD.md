# Build Instructions for KOLIBRI.AI

## Prerequisites

### Required
- **Node.js** 16+ and npm
- **CMake** 3.10+
- **C/C++ Compiler** (gcc, clang, or MSVC)
- **Make** (GNU Make)

### Optional
- **Emscripten** SDK (for WASM build)
- **Git** (for version control)

## Quick Start (5 minutes)

```bash
# Clone repository
git clone https://github.com/rd8r8bkd9m-tech/omega.git
cd omega

# Install frontend dependencies
cd pwa && npm install && cd ..

# Build everything
make all

# Start development server
make dev
```

Visit http://localhost:3000

## Detailed Build Steps

### 1. Build Native Core

```bash
make core
```

This will:
- Create build directory
- Run CMake to generate build files
- Compile C/C++ core library
- Output: `build/core/libkolibri.a`

**Manual build:**

```bash
mkdir -p build/core
cd build/core
cmake ../../core
make
```

### 2. Build WASM Module (Optional)

Requires Emscripten SDK installed.

```bash
make wasm
```

**Install Emscripten:**

```bash
# Get Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh
```

**Manual WASM build:**

```bash
cd wasm
chmod +x build_wasm.sh
./build_wasm.sh
```

Output: `build/wasm/kolibri.wasm` and `build/wasm/kolibri.js`

### 3. Build PWA Frontend

```bash
make frontend
```

This will:
- Install npm dependencies
- Build React app with optimizations
- Generate service worker
- Output: `pwa/build/`

**Manual build:**

```bash
cd pwa
npm install
npm run build
```

### 4. Run Tests

```bash
make test
```

Runs:
- Core unit tests (C/C++)
- Frontend tests (Jest)
- Integration tests

**Manual testing:**

```bash
# Core tests
cd build/core && ctest

# Frontend tests
cd pwa && npm test
```

### 5. Package Release

```bash
make pack
```

Creates `dist/kolibri_ready_v1.zip` containing:
- `/bin` - Core binaries and WASM
- `/web` - Built PWA
- `/docs` - Documentation
- `/examples` - Sample `.kpack` files

## Development Workflow

### Start Development Server

```bash
make dev
# or
cd pwa && npm start
```

Runs PWA at http://localhost:3000 with hot reload.

### Clean Build

```bash
make clean
```

Removes all build artifacts.

### Install Dependencies

```bash
make install-deps
```

Installs all Node.js dependencies.

## Build Flags

### Core Build Options

```bash
# Debug build
cd build/core
cmake -DCMAKE_BUILD_TYPE=Debug ../../core
make

# Release with size optimization
cmake -DCMAKE_BUILD_TYPE=MinSizeRel ../../core
make

# Release with speed optimization
cmake -DCMAKE_BUILD_TYPE=Release ../../core
make
```

### WASM Build Options

Edit `wasm/build_wasm.sh`:

```bash
# Optimize for size
emcc -Os ...

# Optimize for speed
emcc -O3 ...

# Debug mode
emcc -g -O0 ...
```

### Frontend Build Options

```bash
# Production build
cd pwa
npm run build

# Development build
npm run start

# Build with source maps
GENERATE_SOURCEMAP=true npm run build
```

## Platform-Specific Notes

### Linux

```bash
# Install dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install build-essential cmake nodejs npm

# Build
make all
```

### macOS

```bash
# Install dependencies (Homebrew)
brew install cmake node

# Build
make all
```

### Windows

Use WSL2 (Windows Subsystem for Linux) or:

```powershell
# Install via Chocolatey
choco install cmake nodejs

# Build with nmake or use CMake GUI
cd build/core
cmake -G "Visual Studio 16 2019" ../../core
cmake --build . --config Release
```

## Troubleshooting

### CMake not found

```bash
# Install CMake
sudo apt-get install cmake  # Linux
brew install cmake          # macOS
```

### Emscripten not found

The WASM build will be skipped automatically. Install from:
https://emscripten.org/docs/getting_started/downloads.html

### npm install fails

```bash
# Clear cache
npm cache clean --force

# Delete lock file and node_modules
rm -rf pwa/node_modules pwa/package-lock.json

# Reinstall
cd pwa && npm install
```

### Build size too large

Core target: MVP ≤10 MB, goal ≤6.5 MB

```bash
# Check sizes
ls -lh build/core/*.a
ls -lh build/wasm/*.wasm

# Optimize
# - Use MinSizeRel build type
# - Strip symbols: strip libkolibri.a
# - Optimize WASM: emcc -Os
```

## Caching

### CMake Cache

```bash
# Clear CMake cache
rm -rf build/core/CMakeCache.txt build/core/CMakeFiles
```

### npm Cache

```bash
# Clear npm cache
cd pwa
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Continuous Integration

GitHub Actions workflow at `.github/workflows/build.yml`:

```yaml
- Build on Linux, macOS, Windows
- Run all tests
- Generate release artifacts
- Check deterministic builds
```

## Performance Profiling

### Core Profiling

```bash
# Build with profiling
cd build/core
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo ../../core
make

# Profile with gprof
gprof ./test_program gmon.out > analysis.txt
```

### Frontend Profiling

```bash
# Build with profiling
cd pwa
npm run build -- --profile

# Analyze bundle
npm install -g source-map-explorer
source-map-explorer build/static/js/*.js
```

## Size Optimization

### Core

```bash
# Strip symbols
strip build/core/libkolibri.a

# Use link-time optimization
cmake -DCMAKE_INTERPROCEDURAL_OPTIMIZATION=ON ../../core
```

### WASM

```bash
# In build_wasm.sh, add:
-flto                  # Link-time optimization
--closure 1            # Closure compiler
-s ELIMINATE_DUPLICATE_FUNCTIONS=1
```

### Frontend

```bash
# Tree shaking (automatic in production)
# Code splitting (manual)
# Lazy loading components

# Analyze
npm run build
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer pwa/build/static/js/*.js
```

## Reproducible Builds

For deterministic builds:

```bash
# Set build timestamp
export SOURCE_DATE_EPOCH=$(date +%s)

# Build
make clean
make all

# Verify
sha256sum dist/kolibri_ready_v1.zip
```

## Docker Build (Optional)

```dockerfile
FROM node:16 AS builder
WORKDIR /app
COPY . .
RUN make install-deps
RUN make all
RUN make pack

FROM nginx:alpine
COPY --from=builder /app/pwa/build /usr/share/nginx/html
```

```bash
docker build -t kolibri-ai .
docker run -p 8080:80 kolibri-ai
```
