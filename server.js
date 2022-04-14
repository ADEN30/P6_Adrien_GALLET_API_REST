let http = require("http"); // Permet d'utiliser le serveur, avec le protocole http
require('dotenv').config();

let app = require("./app");

app.set('port', process.env.PORT || 3000);

let server  = http.createServer(app); // Création d'un serveur

server.listen(process.env.PORT || 3000); // configuration du port écouté