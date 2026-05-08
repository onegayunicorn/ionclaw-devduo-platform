const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { IONCLAW } = require('../config/constants');

const app = express();
const PORT = IONCLAW.SERVER.PORT;
const PROJECT_ROOT = IONCLAW.PROJECT_PATH;

// Initialize Project Endpoint
app.post('/api/project/initialize', async (req, res) => {
  try {
    await fs.ensureDir(PROJECT_ROOT);
    // Create base structure if missing
    const dirs = ['src', 'config', 'public', 'logs'];
    for (const dir of dirs) {
      await fs.ensureDir(path.join(PROJECT_ROOT, dir));
    }
    res.json({ status: 'success', message: 'Project initialized', path: PROJECT_ROOT });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Server Control
let serverInstance = null;

app.post('/api/server/start', (req, res) => {
  if (!serverInstance) {
    serverInstance = app.listen(PORT, IONCLAW.SERVER.HOST, () => {
      res.json({ status: 'running', endpoint: `http://${IONCLAW.SERVER.HOST}:${PORT}` });
    });
  } else {
    res.json({ status: 'already-running' });
  }
});

app.post('/api/server/stop', (req, res) => {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
    res.json({ status: 'stopped' });
  } else {
    res.json({ status: 'not-running' });
  }
});

app.get('/api/status', (req, res) => {
  res.json({
    ionclaw: serverInstance ? 'running' : 'stopped',
    devduo: 'installed',
    endpoints: IONCLAW.SERVER.ENDPOINTS
  });
});

module.exports = app;
