const Sauce = require("../Models/sauces");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const sauces = require("../Models/sauces");

exports.getAllsauce = (req, res, next) =>{
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

exports.getOnesauce = (req,res, next) =>{
    
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            res.status(200).json(sauce)})
        .catch(error => res.status(404).json({error}));
};

exports.CreateSauce = (req,res, next) =>{
    const objet = JSON.parse(req.body.sauce);
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token,"RANDOM_SECRET_TOKEN");
    const sauce = new Sauce({
        userId: decoded.userId,
        ...objet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(()=> res.status(201).json({message: "Objet créé"}))
        .catch(error => res.status(400).json({error}));
};

exports.ModifySauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then((data)=> {
            const sauce = req.file ?
    {
        
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
    :{
        ...req.body
    };
    Sauce.updateOne({_id: req.params.id}, {...sauce, _id:req.params.id})
        .then( ()=> {
            const filename = data.imageUrl.split('/images/')[1];
            console.log(data.imageUrl);
            if(!req.file){
                 res.status(200).json({message: "Contenu modifié"});
            }
            else{
                fs.unlink(`images/${filename}`,()=> res.status(200).json({message: "Contenu et/ou image modifié"}));
                
            }
            
            })
        .catch((error) => res.status(400).json({error}));
        })
    .catch(error => res.status(400).json({error}))
    
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if(sauce.userId != req.auth.userId){
            return res.status(400).json({message: "Non autorisé"});
        }
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, ()=> {
        Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({error}));
    
          
};

exports.likeSauce = (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
        .then((sauce) =>{
            switch(req.body.like){
                case -1: {
                    sauce.dislikes += 1;
                    sauce.usersDisliked.push(req.auth.userId);
                    sauce.save()
                    .then(()=> res.status(200).json({message: "Disliked"}))
                    .catch(error => res.status(400).json({error}));
                    break;
                }  
                case 0:{
                    const dislike = sauce.usersDisliked.indexOf(req.auth.userId);
                    const like = sauce.usersLiked.indexOf(req.auth.userId);
                    if(dislike != -1){
                        sauce.usersDisliked.splice(dislike);
                        sauce.dislikes -= 1;
                    }
                    else{
                        sauce.usersLiked.splice(like);
                        sauce.likes -= 1;
                    }
                    sauce.save()
                    .then(() => res.status(200).json({message: "Unlike and undisliked"}))
                    .catch(error => res.status(400).json({error}));
                    break;
                }
                case 1: {
                    sauce.likes +=1;
                    sauce.usersLiked.push(req.auth.userId);
                    sauce.save()
                    .then(() => res.status(200).json({message: "Liked"}))
                    .catch(error => res.status(400).json({error}));
                    break;
                }
            }
        })
}