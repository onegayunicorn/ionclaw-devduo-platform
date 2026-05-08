const orchestrator = require('../orchestrator/orchestrator');
const devduo = require('../devduo-ai-engine');

async function runSimulation() {
  console.log("🚀 Starting System Simulation...");
  
  console.log("\n1. Initializing Project...");
  const initRes = await orchestrator.initializeProject();
  console.log("Result:", initRes);

  console.log("\n2. Starting Services...");
  const startRes = await orchestrator.startAll();
  console.log("Result:", startRes);

  console.log("\n3. Testing AI Generation...");
  const genRes = await devduo.generateCode("Create a simple Flutter button");
  console.log("Generated Code Snippet:", genRes.generated.substring(0, 50) + "...");

  console.log("\n4. Checking System Status...");
  const status = orchestrator.getSystemState();
  console.log("Current State:", JSON.stringify(status, null, 2));

  console.log("\n✅ Simulation Complete.");
}

runSimulation().catch(console.error);
