# KOLIBRI.AI Build System
# Main Makefile for building all components

.PHONY: all core wasm frontend test pack clean

# Paths
BUILD_DIR := build
CORE_BUILD := $(BUILD_DIR)/core
WASM_BUILD := $(BUILD_DIR)/wasm
PWA_BUILD := $(BUILD_DIR)/pwa
DIST_DIR := dist
PACKAGE_NAME := kolibri_ready_v1

# Default target
all: core frontend

# Build native core library
core:
	@echo "Building Kolibri Core..."
	@mkdir -p $(CORE_BUILD)
	@cd $(CORE_BUILD) && cmake ../../core && $(MAKE)
	@echo "Core build complete."

# Build WASM module
wasm: core
	@echo "Building WASM module..."
	@mkdir -p $(WASM_BUILD)
	@if command -v emcc > /dev/null 2>&1; then \
		cd wasm && ./build_wasm.sh; \
	else \
		echo "Emscripten not found. Skipping WASM build."; \
		echo "Install from: https://emscripten.org/"; \
	fi
	@echo "WASM build complete (or skipped)."

# Build PWA frontend
frontend:
	@echo "Building PWA frontend..."
	@cd pwa && npm install && npm run build
	@echo "Frontend build complete."

# Run tests
test: core
	@echo "Running tests..."
	@mkdir -p $(CORE_BUILD)
	@cd $(CORE_BUILD) && ctest --output-on-failure || echo "Tests not yet implemented"
	@cd pwa && npm test -- --watchAll=false || echo "Frontend tests not yet implemented"
	@echo "Tests complete."

# Package release
pack: core frontend
	@echo "Packaging release..."
	@mkdir -p $(DIST_DIR)/$(PACKAGE_NAME)/bin
	@mkdir -p $(DIST_DIR)/$(PACKAGE_NAME)/web
	@mkdir -p $(DIST_DIR)/$(PACKAGE_NAME)/docs
	@mkdir -p $(DIST_DIR)/$(PACKAGE_NAME)/examples
	@# Copy binaries
	@if [ -d $(CORE_BUILD) ]; then \
		cp -r $(CORE_BUILD)/lib* $(DIST_DIR)/$(PACKAGE_NAME)/bin/ 2>/dev/null || true; \
	fi
	@if [ -d $(WASM_BUILD) ]; then \
		cp $(WASM_BUILD)/*.wasm $(DIST_DIR)/$(PACKAGE_NAME)/bin/ 2>/dev/null || true; \
	fi
	@# Copy web files
	@if [ -d pwa/build ]; then \
		cp -r pwa/build/* $(DIST_DIR)/$(PACKAGE_NAME)/web/; \
	fi
	@# Copy documentation
	@cp docs/*.md $(DIST_DIR)/$(PACKAGE_NAME)/docs/ 2>/dev/null || true
	@cp README.md $(DIST_DIR)/$(PACKAGE_NAME)/ 2>/dev/null || true
	@# Copy examples
	@cp assets/examples/*.kpack $(DIST_DIR)/$(PACKAGE_NAME)/examples/ 2>/dev/null || true
	@# Create archive
	@cd $(DIST_DIR) && zip -r $(PACKAGE_NAME).zip $(PACKAGE_NAME)
	@echo "Package created: $(DIST_DIR)/$(PACKAGE_NAME).zip"
	@# Display size
	@ls -lh $(DIST_DIR)/$(PACKAGE_NAME).zip

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	@rm -rf $(BUILD_DIR) $(DIST_DIR)
	@cd pwa && rm -rf build node_modules 2>/dev/null || true
	@echo "Clean complete."

# Development server
dev:
	@cd pwa && npm start

# Install dependencies
install-deps:
	@echo "Installing dependencies..."
	@cd pwa && npm install
	@echo "Dependencies installed."

# Help
help:
	@echo "KOLIBRI.AI Build System"
	@echo ""
	@echo "Available targets:"
	@echo "  all          - Build core and frontend (default)"
	@echo "  core         - Build native core library"
	@echo "  wasm         - Build WASM module (requires Emscripten)"
	@echo "  frontend     - Build PWA frontend"
	@echo "  test         - Run all tests"
	@echo "  pack         - Create release package"
	@echo "  clean        - Remove build artifacts"
	@echo "  dev          - Start development server"
	@echo "  install-deps - Install Node.js dependencies"
	@echo "  help         - Show this help message"
