const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
// Note: api-docs/openapi.json might be named openapi.yaml in the repo, checking and using json if possible or providing a placeholder
let swaggerDocument;
try {
  swaggerDocument = require('../api-docs/openapi.json');
} catch (e) {
  swaggerDocument = {}; // Placeholder if file missing
}
const { IONCLAW, DEVDUO } = require('../config/constants');
const twin = require('../entanglement-twins/state-manager');
const app = express();
const PORT = IONCLAW.SERVER.PORT;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('portal-ui'));

// State sync
twin.subscribe('SERVER', (state) => {
  app.locals.systemState = state;
});

// --------------------------
// API ROUTES
// --------------------------

// Status
app.get('/api/status', (req, res) => {
  res.json(twin.getState());
});

// Project Initialize (NO OVERWRITE)
app.post('/api/project/initialize', async (req, res) => {
  try {
    const rootPath = IONCLAW.PROJECT_PATH;
    await fs.ensureDir(rootPath);
    
    const dirs = ['src', 'config', 'public', 'logs', 'tests'];
    const created = [];
    
    for (const dir of dirs) {
      const dirPath = path.join(rootPath, dir);
      if (!await fs.pathExists(dirPath)) {
        await fs.ensureDir(dirPath);
        created.push(dir);
      }
    }
    await twin.update({
      ionclaw: { ...twin.getState().ionclaw, initialized: true, projectPath: rootPath }
    }, 'API');
    res.json({
      status: 'success',
      message: `Project initialized. Created folders: ${created.join(', ') || 'none (already exists)'}`,
      path: rootPath,
      note: 'Existing files NOT overwritten ✅'
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// --------------------------
// SERVER CONTROL - FIXED LOGIC
// --------------------------
let serverInstance = null; // ✅ Now properly tracked

async function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

app.post('/api/server/start', async (req, res) => {
  if (serverInstance) return res.json({ status: 'already_running' });
  try {
    const portFree = await isPortAvailable(PORT);
    if (!portFree) throw new Error(`Port ${PORT} is in use`);
    
    serverInstance = app.listen(PORT, () => {
      console.log(`Server started on ${PORT}`);
    });
    res.json({ status: 'started', port: PORT });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// AI Engine Init
app.post('/api/ai/init', async (req, res) => {
  const { model = 'LITE' } = req.query;
  try {
    const devduo = require('../devduo-ai-engine');
    const result = await devduo.init(model);
    res.json({ status: 'ready', model, specs: DEVDUO.MODELS[model] });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

app.post('/api/ai/generate', async (req, res) => {
  const { prompt, maxTokens = 1024 } = req.body;
  try {
    const devduo = require('../devduo-ai-engine');
    const result = await devduo.generateCode(prompt, maxTokens);
    twin.update({
      metrics: {
        ...twin.getState().metrics,
        tokensGenerated: (twin.getState().metrics?.tokensGenerated || 0) + result.tokensUsed
      }
    }, 'API');
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Docs & Portal
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../portal-ui/index.html')));
app.get('/api/metrics', (req, res) => res.json(require('../evaluation-suite/metrics-collector').collect()));

// --------------------------
// AUTO-START LOGIC - FIXED
// --------------------------
if (require.main === module) {
  (async () => {
    try {
      const portFree = await isPortAvailable(PORT);
      if (!portFree) {
        console.error(`❌ Port ${PORT} in use. Run: npm run fix-port`);
        process.exit(1);
      }
      // ✅ Assign instance properly
      serverInstance = app.listen(PORT, IONCLAW.SERVER.HOST, () => {
        console.log(`✅ IonClaw DevDuo Server STARTED`);
        console.log(`📊 Status: http://localhost:${PORT}/api/status`);
        console.log(`📚 Docs: http://localhost:${PORT}/api/docs`);
        console.log(`🖥️ Portal: http://localhost:${PORT}`);
      });
    } catch (err) {
      console.error('❌ Startup failed:', err.message);
      process.exit(1);
    }
  })();
}

module.exports = app;
