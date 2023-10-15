import { WebSocket } from 'ws';
var Identifier;
const webSocket = new WebSocket('ws://localhost:8081');
const reply=""
webSocket.on('open', () => {
  console.log('Connected to the WebSocket server');
  
});

webSocket.on('message', (message) => {
  const receivedData = JSON.parse(message);
  console.log('Received JSON from server:', receivedData);
  if(receivedData.method==="Init"){
    Identifier= receivedData.value;
    console.log("I got my ID!")
    getReply("Could you explain what your product does?")
  }else if(message.method==="reply"){
    reply=message.content;
    console.log(message.content);
  }
});

webSocket.on('close', () => {
  console.log('Connection closed');
});
function getReply(ms){
    webSocket.send(JSON.stringify({method:"getReply",Id:Identifier,message:ms}))
}

