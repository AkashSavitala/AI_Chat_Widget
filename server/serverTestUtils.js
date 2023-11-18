const http= require('http');
const createWebSocketServer = require("./server").createWebSocketServer;

const startServer = function (port) {
  const server = http.createServer();
  createWebSocketServer({server:server});

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
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
  module.exports = {
    startServer,
    waitForSocketState
  };
