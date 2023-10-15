import { WebSocketServer } from 'ws';
import {v4 as uuidv4} from 'uuid';
//all recieved messages are in this format
/*{
    method: type of message

}*/
//stored as ID=>Connection

var ClientIds=new Map();
//OrganizationIds=new Map();

const wss = new WebSocketServer({ port: 8081 });
console.log("here");
wss.on('connection', (ws) => {
  console.log('Client connected');

  const ClientId=uuidv4()
  ClientIds.set(ClientId,ws)
  const responseData={method:"Init", value:ClientId}
  ws.send(JSON.stringify(responseData));
  

  ws.on('message', (message) => {
    const receivedData = JSON.parse(message);
    console.log(`Received JSON from client `+receivedData.Id , receivedData);
    // Send a JSON response to the client
    const responseData = { response: `Hello, client your ID is ${receivedData.Id}!`};
    ws.send(JSON.stringify(responseData));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
