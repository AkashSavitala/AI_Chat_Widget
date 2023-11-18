const startServer = require("./serverTestUtils").startServer;
const waitForSocketState = require("./serverTestUtils").waitForSocketState;
const sleep = require("./serverTestUtils").sleep;
const WebSocket = require('ws');

startServer(8080);
clientConnectJSON={
    method: "clientConnect"
}
professionalConnectJSON={
    method: "professionalConnect"
}

clientFindCallJSON={
    method: "clientFindCall"
}


const client = new WebSocket("ws://localhost:8080");

const professional = new WebSocket("ws://localhost:8080");

clientRecieved =[]
client.on('message', (message) => {
    clientRecieved.push(JSON.parse(message));
});

professionalRecieved =[]
professional.on('message', (message) => {
    professionalRecieved.push(JSON.parse(message));
});
clientIsOpen = false;
professionalIsOpen = false;
client.onopen = function(event) {
    console.log("client connected");
    clientIsOpen = true;
    if(professionalIsOpen){
        client.send(JSON.stringify(clientConnectJSON));
        sleep(1000).then(()=>{
            professional.send(JSON.stringify(professionalConnectJSON));
            sleep(1000).then(()=>{
                client.send(JSON.stringify(clientFindCallJSON));
                });
        })        
    }
}
professional.onopen = function(event) { 
    console.log("professional connected");
    professionalIsOpen = true;
    if(clientIsOpen){
        client.send(JSON.stringify(clientConnectJSON));
        sleep(1000).then(()=>{
            professional.send(JSON.stringify(professionalConnectJSON));
            sleep(1000).then(()=>{
                client.send(JSON.stringify(clientFindCallJSON));
            });
        })
    }
}
sleep(20000).then(() => {
    console.log(clientRecieved);
    console.log(professionalRecieved);
});