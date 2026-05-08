const ionclawServer = require('../ionclaw-server');
const devduoEngine = require('../devduo-ai-engine');
const twin = require('../entanglement-twins/twin');
const { IONCLAW } = require('../config/constants');

class Orchestrator {
  constructor() {
    this.twin = twin;
    this.setupListeners();
  }

  setupListeners() {
    // Sync state from server
    setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:${IONCLAW.SERVER.PORT}/api/status`);
        const status = await res.json();
        this.twin.updateState({
          ionclaw: { running: status.ionclaw === 'running' },
          devduo: { ready: status.devduo === 'installed' },
          network: { endpoints: status.endpoints }
        });
      } catch (e) { /* ignore if down */ }
    }, 2000);
  }

  async startAll() {
    await fetch(`http://localhost:${IONCLAW.SERVER.PORT}/api/server/start`, { method: 'POST' });
    await devduoEngine.init('LITE');
    this.twin.updateState({ ionclaw: { running: true }, devduo: { ready: true } });
    return { status: 'all-started' };
  }

  async stopAll() {
    await fetch(`http://localhost:${IONCLAW.SERVER.PORT}/api/server/stop`, { method: 'POST' });
    this.twin.updateState({ ionclaw: { running: false }, devduo: { ready: false } });
    return { status: 'all-stopped' };
  }

  async initializeProject() {
    await fetch(`http://localhost:${IONCLAW.SERVER.PORT}/api/project/initialize`, { method: 'POST' });
    return { status: 'project-initialized', path: IONCLAW.PROJECT_PATH };
  }

  getSystemState() {
    return this.twin.getState();
  }
}

module.exports = new Orchestrator();
