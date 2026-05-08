const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api/status',
  method: 'GET',
  timeout: 2000
};

console.log('🏥 Running Health Check...');

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const state = JSON.parse(data);
      console.log('✅ Server: RUNNING');
      console.log(`✅ AI Engine: ${state.devduo.ready ? 'READY' : 'NOT_READY'}`);
      console.log(`✅ Project: ${state.ionclaw.initialized ? 'INITIALIZED' : 'NOT_INITIALIZED'}`);
      process.exit(0);
    } else {
      console.log(`❌ Server returned status: ${res.statusCode}`);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.log(`❌ Server: UNREACHABLE (${err.message})`);
  process.exit(1);
});

req.on('timeout', () => {
  console.log('❌ Server: TIMEOUT');
  req.destroy();
  process.exit(1);
});

req.end();
