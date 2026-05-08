/**
 * Entanglement Twins: mirrors state between IonClaw Server ↔ DevDuo ↔ Orchestrator
 * State is synced bidirectionally; changes propagate instantly
 */
class EntanglementTwin {
  constructor() {
    this.state = {
      ionclaw: { running: false, projectPath: null },
      devduo: { ready: false, model: null },
      network: { endpoints: {} },
      lastUpdate: Date.now()
    };
    this.subscribers = [];
  }

  updateState(partial) {
    this.state = { ...this.state, ...partial, lastUpdate: Date.now() };
    this.notifySubscribers();
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    callback(this.state); // send current state immediately
  }

  notifySubscribers() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  getState() {
    return { ...this.state };
  }
}

module.exports = new EntanglementTwin();
