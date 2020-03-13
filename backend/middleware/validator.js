//Le validateur express est un package pour valider une demande

const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
    return [
        body('email').isEmail(),
        body('password').isLength({ min: 5 })
    ];
};

const validate = (req, res, next) => {
    // gestion des erreurs de validations
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(422).json({
        errors: errors.array()
    });
};

module.exports = {
    userValidationRules,
    validate
};
