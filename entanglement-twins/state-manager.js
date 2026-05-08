class StateManager {
  constructor() {
    this.state = {
      ionclaw: {
        initialized: false,
        projectPath: null,
        status: 'IDLE'
      },
      devduo: {
        ready: false,
        activeModel: null,
        tokenLimit: 0,
        memoryUsage: '0GB'
      },
      metrics: {
        tokensGenerated: 0,
        uptime: 0,
        requests: 0
      },
      timestamp: Date.now()
    };
    this.subscribers = new Map();
  }

  getState() {
    return { ...this.state };
  }

  update(newState, source = 'SYSTEM') {
    this.state = {
      ...this.state,
      ...newState,
      timestamp: Date.now()
    };
    console.log(`[STATE_UPDATE][${source}] State synchronized`);
    this.notify();
  }

  subscribe(id, callback) {
    this.subscribers.set(id, callback);
  }

  notify() {
    this.subscribers.forEach(callback => callback(this.state));
  }
}

module.exports = new StateManager();
