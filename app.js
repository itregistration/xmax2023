const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 443 });
var formidable = require('formidable');
const fs = require('fs');

const readXlsxFile = require('read-excel-file/node')

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

app.listen(8080, () => {
  console.log("Application started and Listening on port 80");
});

app.get("/button", (req, res) => {
  res.sendFile(__dirname + "/button.html");
});

app.get("/panel", (req, res) =>{
  res.sendFile(__dirname + "/panel.html");
});

var uploadedFiles = {};
app.post('/upload', (req, res) =>{
  uploadedFiles = {};

  var form = new formidable.IncomingForm();
  form.on('file', (formname, file) => {
    let rawData = fs.readFileSync(file.filepath);
    uploadedFiles[formname] = rawData;
  })

  form.parse(req, function (err, fields, files) {
    if(uploadedFiles['file'] != undefined){
      readXlsxFile(Buffer.from(uploadedFiles['file'])).then((rows) => {
        res.write(JSON.stringify(rows));
        res.end();
      });    
    }else{
      res.write(JSON.stringify([]));
      res.end();
    }    
  });
});

app.get("/match", (req, res) =>{
  res.sendFile(__dirname + "/match.html");
});