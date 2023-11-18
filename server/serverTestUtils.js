const { TIMEOUT } = require('dns');
const http= require('http');
const createWebSocketServer = require("./server").createWebSocketServer;
const startServer = function(port) {
    createWebSocketServer({port: port});
}  
const waitForSocketState = function(socket, state) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        if (socket.readyState === state) {
          resolve();
        } else {
          waitForSocketState(socket, state).then(resolve);
        }
      }, 5);
    });
  }
  const sleep= function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  module.exports = {
    startServer,
    waitForSocketState,
    sleep
  };
