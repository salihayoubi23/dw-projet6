const express = require('express');
const router = express.Router();

const { userValidationRules, validate } = require('../middleware/validator');

const userCtrl = require('../controllers/user');

// Les routes fournies sont celles prévues par l'application front-end.

router.post('/signup', userValidationRules(), validate, userCtrl.signup);
router.post('/login', userValidationRules(), validate, userCtrl.login);

module.exports = router;