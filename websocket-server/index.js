// dependencies
const express = require('express');
const webSocket = require('ws');
const SocketServer = require('ws').Server;

// initialize a server
const server = express().listen(3000);
// initialize websocket server
const wss = new SocketServer({ server });
// tell to the server what to do when the connection is open
wss.on('connection', (ws) => {
  console.log('[Server] A client was connected');
  // handling events from client
  ws.on('close', () => console.log('[Server] A client was disconnected'));
  ws.on('message', (message) => {
    console.log('[Server] Received message: %s', message);
    // broadcast a message to everyone else who are connected
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === webSocket.OPEN) {
        client.send(message);
      }
    });
  });
});