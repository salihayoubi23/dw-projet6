const mongoose = require('mongoose');

//Dans notre schéma, la valeur unique , avec l'élément mongoose-unique-validator passé comme plug-in, s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail.
const uniqueValidator = require('mongoose-unique-validator');

//Schéma de données qui contient les champs que nous voulons pour chaque utilisateur 

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);