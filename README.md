# KOLIBRI.AI 🐦

> Offline-first knowledge system with formula-based intelligence

[![Build Status](https://github.com/rd8r8bkd9m-tech/omega/workflows/build/badge.svg)](https://github.com/rd8r8bkd9m-tech/omega/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/rd8r8bkd9m-tech/omega/releases)

## Overview

KOLIBRI.AI is a revolutionary approach to artificial intelligence that stores knowledge as **executable formulas** rather than neural network weights. Built on a fractal-decimal kernel with 10 roles (0-9), it operates completely offline and includes a micro-blockchain for integrity.

### Key Features

- 🧬 **Formula-based Knowledge**: Executable code instead of neural weights
- 🔢 **Fractal-Decimal Kernel**: 10 digital particles (0-9) with specific roles
- 🔌 **Offline-First**: Complete local operation, no internet required
- ⚡ **Energy Efficient**: Minimal footprint (≤10 MB core, target ≤6.5 MB)
- 🔗 **Micro-blockchain**: Integrity without heavy infrastructure
- 🌐 **PWA**: Progressive Web App with offline support
- 🎨 **Customizable**: Light/dark themes, drag-and-drop
- 📦 **Portable**: Export/import knowledge packs
- 🔐 **Secure**: Sandboxed execution, Ed25519 signatures
- 🚀 **Scalable**: 10-100 worker cluster support

## Quick Start (5 minutes)

```bash
# Clone repository
git clone https://github.com/rd8r8bkd9m-tech/omega.git
cd omega

# Install dependencies
cd pwa && npm install && cd ..

# Build everything
make all

# Start development server
make dev
```

Visit **http://localhost:3000**

## Architecture

```
┌─────────────────────────────────────────┐
│          PWA Frontend (React)           │
│  Dashboard | Graph | Kernel | Cluster   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         WASM Bridge (JS)                │
│  Worker Pool | Cluster Manager          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Core (C/C++)                    │
│  Formulas | Storage | Execution         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    KolibriChain (Micro-blockchain)      │
│  Blocks | Signatures | Provenance       │
└─────────────────────────────────────────┘
```

## Fractal-Decimal Kernel (0-9)

| Role | Name | Responsibility |
|------|------|----------------|
| 0 | Arbiter | Decision/Aggregation, final vote |
| 1 | Perception | Tokenization, signal normalization |
| 2 | Active Memory | Formula cache, recent context |
| 3 | Long-term Memory | Persistent storage |
| 4 | Analytics | Pattern matching, fitness eval |
| 5 | Mutation | Formula generation, crossover |
| 6 | Execution | Sandbox runtime, scheduling |
| 7 | Goals | Rules, policies, priorities |
| 8 | Federation | Node communication, exchange |
| 9 | Audit | Integrity, signatures, recovery |

## Documentation

- **[Architecture](docs/ARCHITECTURE.md)** - System design and components
- **[Formula DSL](docs/FORMULA_DSL.md)** - Formula language specification
- **[Build Guide](docs/BUILD.md)** - Compilation and optimization
- **[Demo Script](docs/DEMO_SCRIPT.md)** - Step-by-step demonstration

## Build Commands

```bash
make all          # Build core and frontend
make core         # Build native core library
make wasm         # Build WASM module (requires Emscripten)
make frontend     # Build PWA
make test         # Run all tests
make pack         # Create release package
make clean        # Clean build artifacts
make dev          # Start development server
```

## Usage

### Create Formula

```javascript
await db.createFormula({
  inputs: ['x', 'y'],
  outputs: ['result'],
  code: 'result = x + y',
  fitness: 0.95,
  tags: ['math', 'basic'],
  version: 1
});
```

### Execute Formula

```javascript
const result = await core.executeFormula(formulaId, {
  inputs: [10, 20]
});
console.log(result.outputs); // [30]
```

### Export Knowledge

```javascript
const data = await db.exportData();
const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
// Download as .kpack file
```

### Import Knowledge

```javascript
const data = JSON.parse(fileContent);
await db.importData(data);
```

## Performance

- **PWA Start**: ≤2s on average laptops
- **Time to Interactive**: ≤3s  
- **Core Init**: ≤150ms
- **Cluster Start**: ≤500ms
- **Memory per Worker**: ≤64MB @ 10k formulas
- **Artifact Size**: ≤40MB total, core ≤10MB (target ≤6.5MB)

## Offline Support

KOLIBRI.AI works completely offline:
- ✅ Service Worker caches all assets
- ✅ IndexedDB stores all data
- ✅ WASM runs in browser
- ✅ No network requests required
- ✅ Perfect for air-gapped environments

## Use Cases

- 🏭 **Edge Computing**: Process data locally on devices
- 🔒 **Privacy-Critical**: No data leaves device
- ✈️ **Air-Gapped**: Operate without internet
- 📱 **Mobile**: Low power consumption
- 🏥 **Healthcare**: HIPAA-compliant local processing
- 🏦 **Finance**: Secure offline analysis
- 🎮 **Gaming**: AI without latency
- 🤖 **Robotics**: Real-time local intelligence

## Contributing

Contributions welcome! Please read our contributing guidelines first.

```bash
# Fork the repository
# Create a feature branch
git checkout -b feature/amazing-feature

# Make changes
# Test thoroughly
make test

# Commit
git commit -m "Add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Roadmap

- [x] Core formula system
- [x] Micro-blockchain
- [x] PWA frontend
- [x] Offline support
- [x] Cluster management
- [ ] WASM optimization
- [ ] JIT compilation
- [ ] GPU acceleration
- [ ] Multi-node federation
- [ ] Mobile apps (iOS/Android)

## Credits

Built with ❤️ by the KOLIBRI.AI team

Following the fractal-decimal kernel (0-9) architecture concept.

## Support

- 📧 Email: support@kolibri.ai
- 💬 Discord: [Join our community](https://discord.gg/kolibri)
- 📝 Issues: [GitHub Issues](https://github.com/rd8r8bkd9m-tech/omega/issues)
- 📖 Docs: [Full documentation](docs/)

---

**KOLIBRI.AI** - Knowledge through formulas, not weights.
