const User = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.signup = (req, res, next) =>{ //permet a un utilisateur de s'inscrire sur le site

    bcrypt.hash(req.body.password, 10) 
    .then(hash =>{
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(()=> res.status(201).json({message: "Utilisateur créé"}))
            .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req,res, next)=>{ //permet à un utilisateur de se connecter 
    User.findOne({email : req.body.email})
        .then(user => {
            if(!user){
                return res.status(401).json({message: "email invalide"});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valide => {
                    if(!valide){
                        return res.status(401).json({message: "Mot de passe incorect"});
                    }
                    console.log(user._id);
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({userId: user._id}, "RANDOM_SECRET_TOKEN", {expiresIn: "24h"})
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};