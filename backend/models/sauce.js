const mongoose = require('mongoose');

// shema de donnée qui contient les champs que nous voulons , tous obligatoires
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true },
    usersLiked: { type: [String], required: true },
    usersDisliked: { type: [String], required: true },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);