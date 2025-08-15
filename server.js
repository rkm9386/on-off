const WebSocket = require('ws');
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const wss = new WebSocket.Server({ server });
let espSocket = null;

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    message = message.toString();
    console.log('Received:', message);

    if (message === "ESP") {
      espSocket = ws;
      console.log("ESP32 connected");
    } 
    else if (message === "BROWSER") {
      console.log("Browser connected");
    } 
    else {
      if (espSocket && espSocket.readyState === WebSocket.OPEN) {
        espSocket.send(message);
        console.log("Sent to ESP:", message);
      } else {
        console.log("ESP32 not connected");
      }
    }
  });
});
