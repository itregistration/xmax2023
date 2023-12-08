const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 443 });

const clients = new Map();

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };

    clients.set(ws, metadata);

    ws.on('message', (messageAsString) => {
        let msg = String(messageAsString);
        [...clients.keys()].forEach((client) => {
            client.send(msg);
        });
    });
});


function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
console.log("wss up");

const express = require("express");
const app = express();

app.listen(80, () => {
  console.log("Application started and Listening on port 80");
});

app.get("/button", (req, res) => {
  res.sendFile(__dirname + "/button.html");
});

app.get("/viewer", (req, res) =>{
  res.sendFile(__dirname + "/viewer.html");
});
