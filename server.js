const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(3000, () => {
  console.log("🌐 Server listening on port 3000");
});

const wss = new WebSocket.Server({ server });
let espSocket = null;

wss.on('connection', (ws) => {
  console.log("🔗 New WebSocket connection");

  ws.on('message', (message) => {
    message = message.toString();
    console.log(`📩 Received from client: ${message}`);

    if (message === "ESP") {
      espSocket = ws;
      console.log("✅ ESP32 identified and connected");
    } 
    else if (message === "BROWSER") {
      console.log("✅ Browser connected");
    } 
    else {
      console.log(`➡️ Forwarding to ESP: ${message}`);
      if (espSocket && espSocket.readyState === WebSocket.OPEN) {
        espSocket.send(message);
      } else {
        console.log("⚠️ ESP32 not connected — cannot send");
      }
    }
  });

  ws.on('close', () => {
    console.log("❌ A WebSocket client disconnected");
    if (ws === espSocket) {
      espSocket = null;
      console.log("ESP32 disconnected");
    }
  });
});
