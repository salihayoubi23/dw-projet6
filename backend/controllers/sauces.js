
const Sauce = require('../models/sauce');
//package fs de Node
const fs = require('fs');


// Ici, on crée une instance de notre modèle sauce en lui passant un objet JavaScript contenant toutes les informations requises du corps de requête analysé
exports.createSauce = (req, res, next) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = req.protocol + '://' + req.get('host');
    const { input1, input2, input3, input4, input5, input6 } = inputCreate(req);
    if (!input1 || !input2 || !input3 || !input4 || !input5 || !input6) {
        return res.status(400).json({
            message: 'Erreur: les données sur la sauce ne sont pas complètes'
        });
    }
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        imageUrl: url + '/images/' + req.file.filename,
        mainPepper: req.body.sauce.mainPepper,
        usersLiked: [],
        usersDisliked: [],
        userId: req.body.sauce.userId
    });
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce enregistrée!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                message: 'sauces impossible a enregitrer'
            });
        }
    );
};

function inputCreate(req) {
    const input1 = req.body.sauce.name.trim();
    const input2 = req.body.sauce.manufacturer.trim();
    const input3 = req.body.sauce.description.trim();
    const input4 = req.body.sauce.heat;
    const input5 = req.body.sauce.mainPepper.trim();
    const input6 = req.file.filename.trim();
    return { input1, input2, input3, input4, input5, input6 };
}

// voir une seule  sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        //trouver la sauce unique ayant le même _id que le paramètre de la requête
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                message: 'La sauce demandée est introuvable'
            });
        }
    );
};

// 
exports.modifySauce = (req, res, next) => {
    let sauce = new Sauce({ _id: req.params._id });
    // si req.file existe
    if (req.file) {
        req.body.sauce = JSON.parse(req.body.sauce);
        const url = req.protocol + '://' + req.get('host');
        sauce = {
            _id: req.params.id,
            name: req.body.sauce.name,
            manufacturer: req.body.sauce.manufacturer,
            description: req.body.sauce.description,
            heat: req.body.sauce.heat,
            imageUrl: url + '/images/' + req.file.filename,
            mainPepper: req.body.sauce.mainPepper,
            userId: req.body.sauce.userId
        };
  
    } else {
        sauce = {
            _id: req.params.id,
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            description: req.body.description,
            heat: req.body.heat,
            mainPepper: req.body.mainPepper,
            userId: req.body.userId
        };
    }
    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce mise à jour !'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                message: 'impossible de mettre a jour!'
            });
        }
    );
};

//suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    // trouver la sauce grace a l'id
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink('images/' + filename, () => {
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(200).json({
                            message: 'Sauce supprimer!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                message: 'Erreur:sauce impossible a supprimer!'
            });
        }
    );
};

// afficher toutes les sauces 
exports.getAllSauces = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                message: 'Erreur:sauce non trouvée'
            });
        }
    );
};


exports.likeSauce = (req, res, next) => {
    Sauce.find({ _id: req.params.id })
        //Recherchez les tableaux usersLiked et usersDisliked si l'utilisateur est enregistré.
        .then((data) => {
            const dataString = JSON.stringify(data[0]);
            const dataStringJson = JSON.parse(dataString);
            const dataUsersLiked = dataStringJson.usersLiked;
            const dataUsersDisliked = dataStringJson.usersDisliked;
            const resultLiked = dataUsersLiked.includes(req.body.userId);
            const resultDisliked = dataUsersDisliked.includes(req.body.userId);
            //...If POST request = 1
            if (req.body.like === 1) {
                console.log('Request 1');
                postLike(resultLiked, req, res);
                //...If POST request = 1
            } else if (req.body.like === -1) {
                console.log('Request -1');
                postDislike(resultDisliked, req, res);
                //...If POST request = 0
            } else if (req.body.like === 0) {
                console.log('Request 0');
                postCancel(resultLiked, req, res, resultDisliked);
            }
        }).catch(
            (error) => {
                res.status(400).json({
                    message: 'Erreur:la préférence na pas pu être mise à jour'
                });
            }
        );
};

function postLike(resultLiked, req, res) {
    if (resultLiked) {
        console.log('deja preferer');
    } else {
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }).then(
            () => {
                res.status(201).json({
                    message: 'Preference mis a jour !'
                });
            }
        ).catch(
            () => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }
}

function postDislike(resultDisliked, req, res) {
    if (resultDisliked) {
        console.log('deja liker');
    } else {
        Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: 1 } }).then(
            () => {
                res.status(201).json({
                    message: 'Preference mis a jour!'
                });
            }
        ).catch(
            () => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }
}

function postCancel(resultLiked, req, res, resultDisliked) {
    if (resultLiked) {
        console.log('like annulé');
        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }).then(
            () => {
                res.status(201).json({
                    message: 'Preference mis a jour!'
                });
            }
        ).catch(
            () => {
                res.status(400).json({
                    error: error
                });
            }
        );
    } else if (resultDisliked) {
        console.log('dislike annulé');
        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } }).then(
            () => {
                res.status(201).json({
                    message: 'Preference mis a jour!'
                });
            }
        ).catch(
            () => {
                res.status(400).json({
                    error: error
                });
            }
        );
    }
}
