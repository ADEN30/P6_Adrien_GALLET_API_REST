const express = require("express");
const mongoose = require("mongoose");
const UserRoutes = require("./Routes/user");
const SauceRoutes = require("./Routes/sauces");
const path = require("path");
require("dotenv").config();


const app = express();// création de l'application

//connection à mongoDB
mongoose.connect(`mongodb+srv://${process.env.Utilisateur}:${process.env.MP}@cluster0.7sk11.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("Connexion à MongoDB réussie"))
    .catch(()=> console.log("Connexion à MongoDB échouée"));
  

app.use(express.json());//permet d'obtenir directement le body directement sur l'objet req des Content-Type: application/json

//Permet d'éviter les erreurs CORS
app.use((req, res, next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*"); //permet d'accéder à notre API depuis n'iporte quel origine
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");// Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API 
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");// Permet d'envoyer des requêtes e type get, post...
    next();
});


app.use("/images", express.static(path.join(__dirname, "images")));//gère la ressource images de manière static
app.use("/api/auth", UserRoutes);
app.use("/api/sauces",SauceRoutes);




module.exports = app;