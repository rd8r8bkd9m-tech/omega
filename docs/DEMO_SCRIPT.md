# KOLIBRI.AI Demo Script

## Overview

This demo showcases the core features of KOLIBRI.AI: formula-based knowledge system, fractal-decimal kernel (0-9), micro-blockchain, offline operation, and cluster management.

**Duration:** 15-20 minutes
**Prerequisites:** KOLIBRI.AI built and running

## Setup

1. **Start the application:**
   ```bash
   cd omega
   make dev
   # Or serve the built version
   cd pwa/build && python3 -m http.server 3000
   ```

2. **Open browser:** Navigate to http://localhost:3000

3. **Verify offline capability:** Check that the "🟢 Online" badge appears in the header

## Demo Flow

### Part 1: Dashboard & System Overview (3 min)

1. **Initial State**
   - Navigate to Dashboard tab
   - Observe empty state: 0 formulas, 0 executions, 0 mutations
   - Point out the 4 key metrics cards

2. **System Status**
   - Note the version badge (v1.0)
   - Highlight online/offline indicator
   - Switch theme (🌙/☀️ button) to demonstrate customization

3. **Quick Actions**
   - Show the 4 quick action buttons:
     - Create Formula
     - Run Mutation
     - Export Knowledge
     - Search Formulas

### Part 2: Fractal-Decimal Kernel (0-9) (4 min)

1. **Navigate to Kernel (0-9) tab**

2. **Explain the Architecture**
   - 10 digital particles, each with specific role
   - Show the visual grid of roles 0-9

3. **Explore Each Role**
   - Click on Role 0 (Arbiter): Decision/Aggregation
   - Click on Role 1 (Perception): Tokenization
   - Click on Role 2 (Active Memory): Formula cache
   - Click on Role 5 (Mutation): Formula generation
   - Click on Role 6 (Execution): Sandbox runtime
   - Click on Role 9 (Audit): Integrity/Signatures

4. **Show Live Metrics**
   - Each role displays status and load percentage
   - Demonstrate real-time updates

### Part 3: Formula Creation & Storage (3 min)

1. **Open Browser DevTools Console**

2. **Create Sample Formulas Programmatically**
   ```javascript
   // Access the database
   const db = window.db;
   
   // Create first formula
   await db.createFormula({
     inputs: ['x', 'y'],
     outputs: ['sum'],
     code: 'sum = x + y',
     fitness: 0.95,
     tags: ['math', 'basic', 'addition'],
     version: 1
   });
   
   // Create second formula
   await db.createFormula({
     inputs: ['values'],
     outputs: ['mean'],
     code: 'mean = sum(values) / length(values)',
     fitness: 0.87,
     tags: ['math', 'statistics', 'mean'],
     version: 1
   });
   
   // Create third formula  
   await db.createFormula({
     inputs: ['text'],
     outputs: ['tokens'],
     code: 'tokens = split(text, " ")',
     fitness: 0.92,
     tags: ['nlp', 'tokenization'],
     version: 1
   });
   ```

3. **Return to Dashboard**
   - Observe updated metrics: 3 formulas
   - See formulas in "Recent Formulas" section
   - Note tags and fitness scores

### Part 4: Formula Graph Visualization (2 min)

1. **Navigate to Formula Graph tab**

2. **Explain the Visualization**
   - Nodes represent formulas
   - Edges represent dependencies
   - Color indicates fitness
   - Size indicates usage

3. **Interaction** (conceptual)
   - Click nodes to see details
   - Drag to rearrange
   - Zoom and pan
   - Filter by tags

### Part 5: Cluster Management (3 min)

1. **Navigate to Cluster tab**

2. **Configure Cluster**
   - Adjust worker count slider (10-100)
   - Explain: Each worker can execute formulas in parallel
   - Set to 20 workers for demo

3. **Start Cluster**
   - Click "▶️ Start Cluster"
   - Observe status change to "🟢 Running"
   - Watch worker utilization update in real-time

4. **Monitor Performance**
   - Busy workers vs total workers
   - Utilization percentage
   - Worker activity visualization

5. **Stop Cluster**
   - Click "⏹️ Stop Cluster"
   - Status changes to "🔴 Stopped"

### Part 6: Rule Tiers & Policies (2 min)

1. **Navigate to Rule Tiers tab**

2. **Explain Rule Tiers**
   - High Priority: Critical operations (80% CPU budget)
   - Medium Priority: Standard processing (50% CPU budget)
   - Low Priority: Background tasks (20% CPU budget)

3. **Adjust Policies**
   - Slide the CPU budget for High Priority to 90%
   - Explain how this affects formula execution priorities
   - Show impact on resource allocation

4. **Add Rule Tier** (conceptual)
   - Click "➕ Add Rule Tier"
   - Could add "Emergency" or "Maintenance" tiers

### Part 7: Export/Import & Federation (3 min)

1. **Navigate to Import/Export tab**

2. **Export Knowledge**
   - Click "📦 Export as .kpack"
   - File downloads: `kolibri-export-[timestamp].kpack`
   - Explain: Contains all formulas, blocks, metadata

3. **Examine Export** (in text editor)
   ```json
   {
     "version": 1,
     "timestamp": 1234567890,
     "formulas": [...],
     "blocks": [...],
     "metrics": {...}
   }
   ```

4. **Import Knowledge**
   - Click file input to select a .kpack file
   - Or drag-and-drop into the drop zone
   - Success message appears
   - Return to Dashboard to see imported formulas

5. **Explain Federation**
   - Export from Node A
   - Transfer via USB, local network, or sneakernet
   - Import into Node B
   - Micro-blockchain ensures integrity
   - Conflicts resolved by fitness dominance

### Part 8: Offline Operation (2 min)

1. **Test Offline Mode**
   - Open browser DevTools > Network tab
   - Enable "Offline" mode
   - Refresh the page

2. **Verify Offline Functionality**
   - App loads from Service Worker cache
   - Status badge shows "🔴 Offline"
   - All tabs still functional
   - Can create formulas
   - Can view graphs
   - Can manage cluster
   - Can export data

3. **Explain Architecture**
   - Service Worker caches all assets
   - IndexedDB stores all data locally
   - WASM runs in browser
   - No server required
   - Perfect for air-gapped environments

4. **Return Online**
   - Disable "Offline" mode in DevTools
   - Status badge returns to "🟢 Online"

### Part 9: Micro-blockchain & Integrity (2 min)

1. **Open Console**

2. **Create and Verify Blocks**
   ```javascript
   // Get latest block
   const latestBlock = await db.getLatestBlock();
   console.log('Latest block:', latestBlock);
   
   // Create new block with formula IDs
   const formulas = await db.listFormulas();
   const formulaIds = formulas.map(f => f.id);
   
   await db.createBlock({
     formulas: formulaIds,
     author: 'demo-user',
     merkleRoot: '0x...',
     signature: '0x...'
   });
   
   // Verify
   const blockCount = await db.blocks.count();
   console.log('Total blocks:', blockCount);
   ```

3. **Explain Micro-blockchain**
   - Local journal of changes
   - Each block contains formula IDs
   - Merkle root for integrity
   - Ed25519 signatures
   - Lightweight (not mining-based)
   - Provenance tracking

## Advanced Demos (Optional)

### Formula Mutation

```javascript
// Get a formula
const formulas = await db.listFormulas();
const parent = formulas[0];

// Create mutation
const child = {
  ...parent,
  id: undefined,  // Will be auto-generated
  version: parent.version + 1,
  fitness: parent.fitness * (0.95 + Math.random() * 0.1),
  tags: [...parent.tags, 'mutated']
};

await db.createFormula(child);
await db.incrementMetric('mutationCount');

// Verify
const metrics = await db.getMetrics();
console.log('Mutations:', metrics.mutationCount);
```

### Formula Execution (Conceptual)

```javascript
// Execute a formula (requires WASM bridge)
const result = await kolibriCore.executeFormula(
  formulaId,
  { inputs: [10, 20] }
);

console.log('Result:', result.outputs);
await db.incrementMetric('executionCount');
```

### Custom Themes

```javascript
// Set custom theme colors
document.documentElement.style.setProperty('--primary', '#ff6b6b');
document.documentElement.style.setProperty('--secondary', '#4ecdc4');
localStorage.setItem('kolibri-theme', 'custom');
```

## Key Talking Points

1. **No External Dependencies**: Everything runs locally
2. **Formula-based**: Knowledge as executable code, not weights
3. **Deterministic**: Same inputs → same outputs
4. **Energy Efficient**: Minimal footprint (≤10 MB core)
5. **Fractal Architecture**: 10 roles working in harmony
6. **Blockchain Integrity**: Without heavy infrastructure
7. **Offline-First**: Works in air-gapped environments
8. **Scalable**: 10-100 worker cluster
9. **Portable**: Export/import knowledge packs
10. **Secure**: Sandboxed execution, signatures

## Conclusion

KOLIBRI.AI demonstrates a novel approach to AI:
- **Formula-based** instead of neural weights
- **Local-first** instead of cloud-dependent
- **Deterministic** instead of probabilistic
- **Energy-efficient** instead of resource-hungry
- **Transparent** instead of black-box

Perfect for:
- Edge devices
- Embedded systems
- Air-gapped environments
- Privacy-critical applications
- Resource-constrained scenarios

## Next Steps

1. Explore the codebase
2. Create custom formulas
3. Build formula libraries
4. Connect multiple nodes
5. Contribute improvements

Thank you for exploring KOLIBRI.AI!
