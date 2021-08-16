const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    providers: [
        {
            id: {type: Schema.ObjectId}
        }
    ],
}, {timestamps: true});

if (!clientSchema.options.toJSON) clientSchema.options.toJSON = {};
clientSchema.options.toJSON.transform = function (doc, ret, options) {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
    delete ret.createdAt
    delete ret.updatedAt
    ret.providers = ret.providers.map(provider => {
        return {
            id: provider.id
        }
    })
    return ret
}
const Client = mongoose.model('Client', clientSchema);
module.exports = Client;