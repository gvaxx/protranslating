const { body } = require('express-validator')
const Provider = require('../models/Provider')

const providerValidator = [
    body('name').not().isEmpty().custom(async (name, {req}) => {
        if ((await Provider.findOne({name: name}))) {
            throw new Error('Provider name must be unique');
        }
        return true;
    }),
]
module.exports = providerValidator;
