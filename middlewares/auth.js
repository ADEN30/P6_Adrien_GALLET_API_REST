const jwt = require("jsonwebtoken");
module.exports = (req, res, next) =>{ //vérifie l'authentification d'un compte
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,"RANDOM_SECRET_TOKEN");//vérifie le token de l'utilisateur
        const userId = decoded.userId;
        req.auth = ({userId});
        if(req.body.userId && req.body.userId != userId){
            throw "User ID non valide";
        }
        else{
            next();
        }
    }
    catch(error) {
        res.status(401).json({error: new Error('Invalide request')})
    };
}
                