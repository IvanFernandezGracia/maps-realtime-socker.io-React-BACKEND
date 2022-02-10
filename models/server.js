// Servidor de Express
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const Sockets = require("./sockets");
var cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    // Http server
    this.server = http.createServer(this.app);
    this.corsOptions = {
      origin: function (origin, callback) {
        if (
          [
            process.env.DOMAIN_FRONT_REACT_PROD,
            process.env.DOMAIN_FRONT_REACT_DEV,
          ].indexOf(origin) !== -1
        ) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
        console.log([
          process.env.DOMAIN_FRONT_REACT_PROD,
          process.env.DOMAIN_FRONT_REACT_DEV,
        ]);
      },
    };

    // Configuraciones de sockets
    this.io = socketio(this.server, {
      origins: process.env.DOMAIN_FRONT_REACT,
    });

    console.log("init: " + process.env.DOMAIN_FRONT_REACT);
  }

  middlewares() {
    // CORS
    this.app.use(cors(this.corsOptions));

    // Lectura y parseo del body
    this.app.use(express.json());

    // Desplegar el directorio público
    this.app.use(express.static(path.resolve(__dirname, "../public")));
  }

  // Esta configuración se puede tener aquí o como propieda de clase
  // depende mucho de lo que necesites
  configurarSockets() {
    new Sockets(this.io);
  }

  execute() {
    // Inicializar Middlewares
    this.middlewares();

    // Inicializar sockets
    this.configurarSockets();

    // Inicializar Server
    this.server.listen(this.port, () => {
      console.log("Server corriendo en puerto:", this.port);
    });
  }
}

module.exports = Server;
