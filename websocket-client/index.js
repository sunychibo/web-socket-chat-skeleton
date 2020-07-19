// set websocket connection
const Html5WebSocket = require('html5-websocket');
const ReconnectingWebSocket = require('reconnecting-websocket');
const WS = require('ws');

//websocket initialization
let ws_host = 'localhost';
let ws_port = '3000';
let options = { WebSocket: WS };
let rws = new ReconnectingWebSocket('ws://' + ws_host + ':' + ws_port + '/ws', undefined, options);
rws.timeout = 1000;
rws.addEventListener('open', () => {
 console.log('[Client] Connection to WebSocket server was opened');
 rws.send('Hello, this is a message from a client');
 rws.send(JSON.stringify({
   method: 'set-background-color',
   params: {
     color: 'blue'
   }
 }));
});
rws.addEventListener('message', (e) => {
 console.log('[Client] Message received: ' + e.data);
 try {
   let message = JSON.parse(e.data);
   messageHandler(message);
 } catch (error) {
   console.log('[Client] Message is not parseable to JSON.')
 }
});
rws.addEventListener('close', () => {
 console.log('[Client] Connection closed - internet connection lost or server is shutted down');
});
rws.onerror = (error) => {
  if (error.code === 'EHOSTDOWN') {
    console.log('[Client] Error: Server down');
  }
};

// message handler
let handlers = {
  'set-background-color': function(message) {
    // logic...
    console.log('[Client] set-background-color handler');
    console.log('[Client] Color is ' + message.params.color);
  }
}

function messageHandler(message) {
  if (message.method === undefined) return;
  let method = message.method;
  if (handlers[method]) {
    let handler = handlers[method];
    handler(message);
  } else {
    console.log('[Client] No handler defined for nethod' + method + '.');
  }
}