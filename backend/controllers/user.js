
//hachage de mot de passe: le mot de passe de l'utilisateur est stocké dans la base de données sous forme de chaîne cryptée
const bcrypt = require('bcrypt');

//permette aux utilisateurs de ne se connecter qu'une seule fois à leur compte
const jwt = require('jsonwebtoken');
// on importe notre model user 
const User = require('../models/user');

//POST route
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(
        (hash) => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'Utilisateur crée!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

//POST route
exports.login = (req, res, next) => {
    //vérification de l'utilisateur dans la base de donnée
    User.findOne({ email: req.body.email }).then(
        (user) => {
           // si l'utilisateur n'est pas dans la base de donné
            if (!user) {
                return res.status(401).json({
                    error: new Error('Utilisateur non trouver!')
                });
            }
            // on compare le mot de passe saisi par l'utilisateur avec le hachage enregistré dans la base de données
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                  
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('mot de passe incorrect!')
                        });
                    }
                   //nous utilisons la fonction sign dejsonwebtoken pour encoder un nouveau token
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' });
                    
                    // Renvoie au frontend les informations de l'utilisateur authentifié
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch(
                (error) => {
                    console.log(error);
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        }
    );
};