function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })
}
class Client {
    constructor(connection) {
        this.inCall = false;
        this.textHistory = [];
        this.connection = connection;
        this.id=guid();
        this.recieverId = null;
    }
    
    addMessageToHistory(message) {
        this.textHistory.push(message);
    }

    clearHistory() {
        this.textHistory = [];
    }
}

class Professional {
    constructor(connection) {
        this.inCall = false;
        this.connection = connection;
        this.id=guid();
        this.recieverId = null;
    }


    setAvailability(availability) {
        this.isAvailable = availability;
    }

}


const WebSocket = require('ws');
const createWebSocketServer = function (server) {
    let clients = []; // Array to store clients
    let professionals = []; // Array to store professionals
    const wss = new WebSocket.Server(server);

    wss.on('connection', (ws) => {
        console.log('A new client connected');
        // Handle incoming messages
        ws.on('message', (message) => {
            processMessage(message, ws);
        });

        ws.on('close', () => {
            console.log('Client disconnected');
            // Handle client disconnection
            if(clients.find(client => client.connection === ws)){
                const client = clients.find(client => client.connection === ws);
                //if the client is in a call, the server ends the call and sends a message to the professional
                if(client.inCall){
                    const professional = professionals.find(professional => professional.id === client.recieverId);
                    professional.connection.send(JSON.stringify({method: 'endCall'}));
                    professional.isAvailable = true;
                }
                clients.splice(clients.indexOf(client), 1);
            }else if(professionals.find(professional => professional.connection === ws)){
                const professional = professionals.find(professional => professional.connection === ws);
                //if the professional is in a call, the server ends the call and sends a message to the client
                if(professional.inCall){
                    const client = clients.find(client => client.id === professional.recieverId);
                    client.connection.send(JSON.stringify({method: 'endCall'}));
                }
                professionals.splice(professionals.indexOf(professional), 1);
            }
    });
    });
    function processMessage(message, ws){
        console.log('Received message:', message);
            const parsedMessage = JSON.parse(message);
            //First the client and the professional connect to the server
            if (parsedMessage.method === 'clientConnect') {
                clientConnect(ws);
            }
            else if(parsedMessage.method === 'professionalConnect') {
                professionalConnect(ws);
            //then if the client wants to call the professional, the server finds an available professional and sends the message history to the professional
            }else if(parsedMessage.method === 'clientFindCall'){
                clientFindCall(ws);
            //now either the professional or the client can send messages to each other
            }else if(parsedMessage.method === 'clientMessage') {
                clientMessage(ws, parsedMessage);
            }else if(parsedMessage.method === 'professionalMessage') {
                professionalMessage(ws, parsedMessage);  
            }
    }
    //message has a method which is professionalConnect
    function professionalConnect(ws){
        const professional = new Professional(ws);
        professionals.push(professional);
        console.log('Added professional to the array:', professional);
    }
    //message has a method which is clientConnect
    function clientConnect(ws){
        const client = new Client(ws);
        clients.push(client);
        console.log('Added client to the array:', client);
    }
    //message has a method which is clientFindCall
    function clientFindCall(ws){
        const client = clients.find(client => client.connection === ws);
        const professional = professionals.find(professional => professional.isAvailable);
        if(professional){
            professional.isAvailable = false;
            client.inCall = true;
            professional.recieverId = client.id;
            client.recieverId = professional.id;
            professional.connection.send(JSON.stringify({method: 'recieveCall', message: client.textHistory}));
        }
    }
    //message has a method which is clientMessage and has a content which is the sent message from the client
    function clientMessage(ws, message){
        const client = clients.find(client => client.connection === ws);
        if(client.inCall){
            const professional = professionals.find(professional => professional.id === client.recieverId);
            professional.connection.send(JSON.stringify({method: 'recieveMessage', message: message.content}));
        }
        console.log('Client message:', client.currentMessage);
    }
    //message has a method which is professionalMessage and has a content which is the sent message from the professional
    function professionalMessage(ws, message){
        const professional = professionals.find(professional => professional.connection === ws);
        if(professional.inCall){
            const client = clients.find(client => client.id === professional.recieverId);
            client.connection.send(JSON.stringify({method: 'recieveMessage', message: message.content}));
        }
        console.log('Professional message:', professional.currentMessage);
    }
}
//createWebSocketServer({ port: 8080 });
module.exports = {createWebSocketServer};

