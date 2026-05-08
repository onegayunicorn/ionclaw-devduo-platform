// Extracted constants
module.exports = {
  IONCLAW: {
    PROJECT_PATH: "/data/user/0/com.ionclaw.app/app_flutter/ionclaw/project",
    SERVER: {
      HOST: "0.0.0.0",
      PORT: 8080,
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
      LITE: { size: "2.58GB", minRam: "6GB", tokens: 1024 },
      HIGH_POWER: { size: "3.65GB", minRam: "8GB+", tokens: 2048 }
    },
    STATUS: "INSTALLED",
    SETUP_REQUIRED: "RESTART_APP"
  },
  NETWORK: {
    PROTOCOL: "http",
    BIND_ALL_INTERFACES: "0.0.0.0"
  }
};
