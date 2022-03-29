const express = require("express");
const Ctrl = require("../Controllers/sauces");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

const route = express.Router();


route.get("/", auth,Ctrl.getAllsauce);
route.post("/", auth, multer, Ctrl.CreateSauce);
route.get("/:id",auth, Ctrl.getOnesauce);
route.put("/:id",auth, multer, Ctrl.ModifySauce);
route.delete("/:id",auth, Ctrl.deleteSauce);
route.post("/:id/like", auth, Ctrl.likeSauce);




module.exports = route;

