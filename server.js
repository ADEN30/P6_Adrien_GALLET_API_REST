let http = require("http");

let app = require("./app");

app.set('port', process.env.PORT || 3000);

let server  = http.createServer(app);

server.listen(process.env.PORT || 3000);