import Dexie from 'dexie';

export class KolibriDB extends Dexie {
  constructor() {
    super('KolibriDB');
    
    this.version(1).stores({
      formulas: '++id, version, fitness, timestamp, *tags',
      blocks: '++blockNumber, timestamp',
      metrics: 'key',
      settings: 'key'
    });

    this.formulas = this.table('formulas');
    this.blocks = this.table('blocks');
    this.metrics = this.table('metrics');
    this.settings = this.table('settings');
  }

  async init() {
    await this.open();
    
    // Initialize default settings
    const existingSettings = await this.settings.get('theme');
    if (!existingSettings) {
      await this.settings.add({ key: 'theme', value: 'light' });
    }

    // Initialize metrics
    const existingMetrics = await this.metrics.get('global');
    if (!existingMetrics) {
      await this.metrics.add({
        key: 'global',
        formulaCount: 0,
        executionCount: 0,
        mutationCount: 0,
        avgFitness: 0
      });
    }
  }

  // Formula operations
  async createFormula(formula) {
    const timestamp = Date.now();
    const id = await this.formulas.add({
      ...formula,
      timestamp,
      version: formula.version || 1
    });
    
    await this.incrementMetric('formulaCount');
    return id;
  }

  async getFormula(id) {
    return await this.formulas.get(id);
  }

  async updateFormula(id, updates) {
    await this.formulas.update(id, updates);
  }

  async deleteFormula(id) {
    await this.formulas.delete(id);
    await this.decrementMetric('formulaCount');
  }

  async listFormulas(filter = {}) {
    let query = this.formulas;
    
    if (filter.tags && filter.tags.length > 0) {
      query = query.where('tags').anyOf(filter.tags);
    }
    
    return await query.toArray();
  }

  async searchFormulas(searchTerm) {
    const allFormulas = await this.formulas.toArray();
    return allFormulas.filter(f => 
      (f.inputs && f.inputs.join(' ').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.outputs && f.outputs.join(' ').toLowerCase().includes(searchTerm.toLowerCase())) ||
      (f.tags && f.tags.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Block operations
  async createBlock(block) {
    const timestamp = Date.now();
    const blockNumber = await this.blocks.count();
    
    return await this.blocks.add({
      ...block,
      blockNumber,
      timestamp
    });
  }

  async getBlock(blockNumber) {
    return await this.blocks.where('blockNumber').equals(blockNumber).first();
  }

  async getLatestBlock() {
    return await this.blocks.orderBy('blockNumber').last();
  }

  async listBlocks(limit = 100) {
    return await this.blocks.orderBy('blockNumber').reverse().limit(limit).toArray();
  }

  // Metrics operations
  async getMetrics() {
    const metrics = await this.metrics.get('global');
    if (!metrics) {
      return {
        formulaCount: 0,
        executionCount: 0,
        mutationCount: 0,
        avgFitness: 0
      };
    }
    return metrics;
  }

  async incrementMetric(metric) {
    const current = await this.metrics.get('global');
    if (current) {
      await this.metrics.update('global', {
        [metric]: (current[metric] || 0) + 1
      });
    }
  }

  async decrementMetric(metric) {
    const current = await this.metrics.get('global');
    if (current && current[metric] > 0) {
      await this.metrics.update('global', {
        [metric]: current[metric] - 1
      });
    }
  }

  async updateMetric(metric, value) {
    await this.metrics.update('global', {
      [metric]: value
    });
  }

  // Settings operations
  async getSetting(key) {
    const setting = await this.settings.get(key);
    return setting ? setting.value : null;
  }

  async setSetting(key, value) {
    const existing = await this.settings.get(key);
    if (existing) {
      await this.settings.update(key, { value });
    } else {
      await this.settings.add({ key, value });
    }
  }

  // Export/Import
  async exportData() {
    const formulas = await this.formulas.toArray();
    const blocks = await this.blocks.toArray();
    const metrics = await this.metrics.toArray();
    
    return {
      version: 1,
      timestamp: Date.now(),
      formulas,
      blocks,
      metrics
    };
  }

  async importData(data) {
    if (data.formulas) {
      await this.formulas.bulkAdd(data.formulas);
    }
    
    if (data.blocks) {
      await this.blocks.bulkAdd(data.blocks);
    }
    
    if (data.metrics) {
      for (const metric of data.metrics) {
        await this.metrics.put(metric);
      }
    }
  }

  async clearAll() {
    await this.formulas.clear();
    await this.blocks.clear();
    await this.metrics.clear();
    await this.init();
  }
}
