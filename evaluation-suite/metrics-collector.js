const twin = require('../entanglement-twins/state-manager');

class MetricsCollector {
  constructor() {
    this.startTime = Date.now();
  }

  collect() {
    const state = twin.getState();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    return {
      uptime,
      serverStatus: state.ionclaw.status,
      aiReady: state.devduo.ready,
      activeModel: state.devduo.activeModel,
      tokensGenerated: state.metrics.tokensGenerated,
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024 + ' MB',
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = new MetricsCollector();
