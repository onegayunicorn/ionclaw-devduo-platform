const readline = require('readline');
const orchestrator = require('../orchestrator/orchestrator');
const devduo = require('../devduo-ai-engine');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'ionclaw-devduo> '
});

console.log('=== IonClaw + DevDuo Terminal ===');
console.log('Commands: start, stop, init, status, generate [prompt], exit\n');
rl.prompt();

rl.on('line', async (line) => {
  const cmd = line.trim();
  try {
    if (cmd === 'start') {
      const res = await orchestrator.startAll();
      console.log('✅', res);
    } else if (cmd === 'stop') {
      const res = await orchestrator.stopAll();
      console.log('🛑', res);
    } else if (cmd === 'init') {
      const res = await orchestrator.initializeProject();
      console.log('📁', res);
    } else if (cmd === 'status') {
      const state = orchestrator.getSystemState();
      console.log('📊 System State:\n', JSON.stringify(state, null, 2));
    } else if (cmd.startsWith('generate ')) {
      const prompt = cmd.slice(9);
      const res = await devduo.generateCode(prompt);
      console.log('💻 Generated Code:\n', res.generated);
    } else if (cmd === 'exit') {
      rl.close();
    } else {
      console.log('❓ Unknown command');
    }
  } catch (e) {
    console.error('⚠️ Error:', e.message);
  }
  rl.prompt();
});
