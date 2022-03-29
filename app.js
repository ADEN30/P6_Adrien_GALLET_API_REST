const express = require("express");
const mongoose = require("mongoose");
const UserRoutes = require("./Routes/user");
const SauceRoutes = require("./Routes/sauces");
const path = require("path");


const app = express();

mongoose.connect("mongodb+srv://Zed:Validation68@cluster0.7sk11.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("Connexion à MongoDB réussie"))
    .catch(()=> console.log("Connexion à MongoDB échouée"));
  

app.use(express.json());

app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});


app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", UserRoutes);
app.use("/api/sauces",SauceRoutes);




module.exports = app;