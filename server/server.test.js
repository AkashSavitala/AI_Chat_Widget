const testModule= require("node:test");
const startServer = require("./serverTestUtils").startServer;
const waitForSocketState = require("./serverTestUtils").waitForSocketState;
const WebSocket = require('ws');

const port=8080;
const port2=8081;
testModule.describe("WebSocket Server", () => {
    beforeAll(async () => {
       let server= await startServer(port);
    });
    afterAll(() => {});

    test("Client tries to find a call when one Professional is available", async () => {
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
        await waitForSocketState(client, WebSocket.OPEN);

        const professional = new WebSocket("ws://localhost:8080");
        await waitForSocketState(professional, WebSocket.OPEN);

        clientRecieved =[]
        client.on('message', (message) => {
            clientRecieved.push(message);
        });

        professionalRecieved =[]
        professional.on('message', (message) => {
            professionalRecieved.push(message);
        });

        client.send(JSON.stringify(clientConnectJSON));
        professional.send(JSON.stringify(professionalConnectJSON));
        client.send(JSON.stringify(clientFindCallJSON));
        
        //client should have an empty array
        //professional should have ID of client
        expect(clientRecieved).toEqual([]);
        });

    test("Client tries to find a call when one Professional is available", async () => {
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
        await waitForSocketState(client, WebSocket.OPEN);

        const professional = new WebSocket("ws://localhost:8080");
        await waitForSocketState(professional, WebSocket.OPEN);

        clientRecieved =[]
        client.on('message', (message) => {
            clientRecieved.push(message);
        });

        professionalRecieved =[]
        professional.on('message', (message) => {
            professionalRecieved.push(message);
        });

        client.send(JSON.stringify(clientConnectJSON));
        professional.send(JSON.stringify(professionalConnectJSON));
        client.send(JSON.stringify(clientFindCallJSON));
        
        //client should have an empty array
        //professional should have ID of client
        expect(professionalRecieved).toEqual([{method: 'recieveCall', message: []}]);
    });
});