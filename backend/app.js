
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// chemin de donnée serveur
const path = require('path');

const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');

const app = express();
// connection a mango db
mongoose.connect('mongodb+srv://saliha:9NlfRLLoYvRWxeBg@cluster0-iryyl.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
// gestions erreurs cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Extraire l'objet JSON des requête POST
app.use(bodyParser.json());
// indique à Express qu'il faut gérer la ressource images dans le dossier image
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;



