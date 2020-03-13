//middleware d'authentification qui va s'assurer 
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //pour prévoir les problemes on met tous dans un bloc try catch 
    try {
        //nous extrayons le token du header Authorization de la requête entrante
        const token = req.headers.authorization.split(' ')[1];
        // nous utilisons ensuite la fonction verify pour décoder notre token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        //validation ou non du token 
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};