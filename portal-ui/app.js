const API = "http://localhost:8080/api";

// Update status every 2s
async function updateStatus() {
  try {
    const res = await fetch(`${API}/status`);
    const state = await res.json();
    document.getElementById("server-status").textContent = state.ionclaw.running ? "Running ✅" : "Stopped ❌";
    document.getElementById("ai-status").textContent = state.devduo.ready ? "Ready ✅" : "Not Initialized ⚠️";
    document.getElementById("endpoint").textContent = state.network.endpoints.LAN || "http://localhost:8080";
  } catch (e) {
    console.log("Server not reachable");
  }
}

// Buttons
document.getElementById("btn-start").addEventListener("click", async () => {
  await fetch(`${API}/server/start`, {method:"POST"});
  await fetch(`${API}/ai/init?model=LITE`, {method:"POST"});
  updateStatus();
});

document.getElementById("btn-stop").addEventListener("click", async () => {
  await fetch(`${API}/server/stop`, {method:"POST"});
  updateStatus();
});

document.getElementById("btn-init").addEventListener("click", async () => {
  await fetch(`${API}/project/initialize`, {method:"POST"});
  alert("Project Initialized");
});

document.getElementById("btn-generate").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const res = await fetch(`${API}/ai/generate`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({prompt, maxTokens:1024})
  });
  const data = await res.json();
  document.getElementById("output").textContent = data.generated;
});

setInterval(updateStatus, 2000);
updateStatus();
