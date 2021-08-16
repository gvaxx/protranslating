const mongoose = require('mongoose')
const { param } = require('express-validator')

const ObjectIdInParamValidator = [
    param('id').custom(async (id, {req}) => {
        if (!id || !mongoose.isValidObjectId(id)) {
            throw new Error('id must be ObjectID');
        }
        return true;
    }),
]
module.exports = ObjectIdInParamValidator;
