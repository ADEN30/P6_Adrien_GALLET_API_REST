const express = require("express");
const Ctrl = require("../Controllers/user");

const route = express.Router();

route.post("/signup", Ctrl.signup);
route.post("/login", Ctrl.login);

module.exports = route;