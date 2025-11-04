/**
 * Kolibri WASM Bridge
 * JavaScript interface to Kolibri Core WASM module
 */

export class KolibriWASM {
  constructor() {
    this.module = null;
    this.core = null;
    this.chain = null;
  }

  async init(wasmPath = '/kolibri.wasm') {
    // Load WASM module
    const KolibriCore = await import(wasmPath.replace('.wasm', '.js'));
    this.module = await KolibriCore.default();

    // Initialize core
    const initPtr = this.module.ccall(
      'kolibri_init',
      'number',
      ['string'],
      ['/kolibri_storage']
    );
    
    if (!initPtr) {
      throw new Error('Failed to initialize Kolibri core');
    }
    
    this.core = initPtr;

    // Initialize chain
    const chainPtr = this.module.ccall(
      'chain_init',
      'number',
      ['string'],
      ['/kolibri_chain']
    );
    
    if (!chainPtr) {
      throw new Error('Failed to initialize Kolibri chain');
    }
    
    this.chain = chainPtr;

    return this;
  }

  destroy() {
    if (this.core) {
      this.module.ccall('kolibri_destroy', null, ['number'], [this.core]);
      this.core = null;
    }
    
    if (this.chain) {
      this.module.ccall('chain_destroy', null, ['number'], [this.chain]);
      this.chain = null;
    }
  }

  createFormula(formula) {
    if (!this.core) throw new Error('Core not initialized');

    // Allocate formula structure in WASM memory
    const formulaSize = 4096 + 256; // Approximate size
    const formulaPtr = this.module._malloc(formulaSize);
    
    try {
      // Fill formula structure
      // (Simplified - in production would properly serialize all fields)
      const result = this.module.ccall(
        'kolibri_formula_create',
        'number',
        ['number', 'number'],
        [this.core, formulaPtr]
      );

      return result === 0;
    } finally {
      this.module._free(formulaPtr);
    }
  }

  getMetrics() {
    if (!this.core) throw new Error('Core not initialized');

    const metricsSize = 40; // sizeof(kolibri_metrics_t)
    const metricsPtr = this.module._malloc(metricsSize);
    
    try {
      const result = this.module.ccall(
        'kolibri_get_metrics',
        'number',
        ['number', 'number'],
        [this.core, metricsPtr]
      );

      if (result !== 0) {
        return null;
      }

      // Read metrics from memory
      const metrics = {
        formulaCount: this.module.getValue(metricsPtr, 'i64'),
        executionCount: this.module.getValue(metricsPtr + 8, 'i64'),
        mutationCount: this.module.getValue(metricsPtr + 16, 'i64'),
        memoryUsed: this.module.getValue(metricsPtr + 24, 'i64'),
        avgFitness: this.module.getValue(metricsPtr + 32, 'float')
      };

      return metrics;
    } finally {
      this.module._free(metricsPtr);
    }
  }

  getChainInfo() {
    if (!this.chain) throw new Error('Chain not initialized');

    const infoSize = 48; // sizeof(chain_info_t)
    const infoPtr = this.module._malloc(infoSize);
    
    try {
      const result = this.module.ccall(
        'chain_get_info',
        'number',
        ['number', 'number'],
        [this.chain, infoPtr]
      );

      if (result !== 0) {
        return null;
      }

      const info = {
        blockCount: this.module.getValue(infoPtr, 'i32'),
        totalFormulas: this.module.getValue(infoPtr + 4, 'i64'),
        latestHash: []
      };

      // Read hash
      for (let i = 0; i < 32; i++) {
        info.latestHash.push(this.module.getValue(infoPtr + 12 + i, 'i8'));
      }

      return info;
    } finally {
      this.module._free(infoPtr);
    }
  }
}

// Worker pool for cluster execution
export class KolibriCluster {
  constructor(size = 10) {
    this.workers = [];
    this.size = size;
    this.initialized = false;
  }

  async init() {
    // Create worker pool
    for (let i = 0; i < this.size; i++) {
      const worker = new Worker('/kolibri-worker.js');
      this.workers.push({
        worker,
        busy: false,
        id: i
      });
    }

    // Initialize each worker
    await Promise.all(
      this.workers.map(w => 
        new Promise((resolve) => {
          w.worker.onmessage = (e) => {
            if (e.data.type === 'ready') {
              resolve();
            }
          };
          w.worker.postMessage({ type: 'init' });
        })
      )
    );

    this.initialized = true;
  }

  async executeFormula(formulaId, inputs) {
    if (!this.initialized) {
      throw new Error('Cluster not initialized');
    }

    // Find available worker
    const available = this.workers.find(w => !w.busy);
    if (!available) {
      throw new Error('No workers available');
    }

    available.busy = true;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        available.busy = false;
        reject(new Error('Execution timeout'));
      }, 5000);

      available.worker.onmessage = (e) => {
        clearTimeout(timeout);
        available.busy = false;
        
        if (e.data.type === 'result') {
          resolve(e.data.result);
        } else if (e.data.type === 'error') {
          reject(new Error(e.data.error));
        }
      };

      available.worker.postMessage({
        type: 'execute',
        formulaId,
        inputs
      });
    });
  }

  destroy() {
    this.workers.forEach(w => w.worker.terminate());
    this.workers = [];
    this.initialized = false;
  }

  getMetrics() {
    return {
      totalWorkers: this.size,
      busyWorkers: this.workers.filter(w => w.busy).length,
      availableWorkers: this.workers.filter(w => !w.busy).length
    };
  }
}
