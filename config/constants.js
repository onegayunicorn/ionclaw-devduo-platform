module.exports = {
  IONCLAW: {
    // CHANGED: Local path instead of system /data (fixed permission error)
    PROJECT_PATH: process.env.PROJECT_PATH || "./data/project",
    SERVER: {
      HOST: "0.0.0.0",
      PORT: parseInt(process.env.PORT || 8080),
      ENDPOINTS: {
        LOCAL: "http://localhost:8080",
        LAN: "http://192.168.1.108:8080",
        MOBILE: "http://10.54.238.86:8080"
      },
      OPERATIONS: ["start", "stop", "initialize", "open-panel"]
    }
  },
  DEVDUO: {
    MODELS: {
      LITE: { size: "2.58GB", minRam: "6GB", tokens: 1024, path: "./models/devduo-lite" },
      HIGH_POWER: { size: "3.65GB", minRam: "8GB+", tokens: 2048, path: "./models/devduo-high" }
    },
    STATUS: "INSTALLED",
    SETUP_REQUIRED: "RESTART_APP"
  },
  NETWORK: {
    PROTOCOL: "http",
    BIND_ALL_INTERFACES: "0.0.0.0"
  },
  SANDBOX: {
    PATH: "./sandbox/project",
    MODE: process.env.SANDBOX_MODE === "true"
  }
};
