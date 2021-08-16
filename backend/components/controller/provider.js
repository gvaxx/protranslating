const Provider = require('../models/Provider');
const Client = require('../models/Client');
const { validationResult } = require('express-validator')

exports.createProvider = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const provider = new Provider(req.body)
        await provider.save()
        res.json(provider.toJSON({transform: true}))
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.find().sort({createdAt: -1})
        if (!providers) {
            return res.status(404).json({
                error: "Providers not found"
            });
        }
        return res.json(providers.map(provider => provider.toJSON({transform: true})))
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

exports.updateProviderById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if (!provider) {
            return res.status(404).json({
                error: "Provider not found"
            });
        }
        return res.json(provider.toJSON({transform: true}))
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}

exports.deleteProviderById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors);
        }
        const hasProviderClient = await Client.findOne({"providers.id": req.params.id})
        console.log(hasProviderClient);
        if (hasProviderClient) {
            return res.status(403).json({
                error: "Provider attached to client"
            });
        }
        if (! await Provider.findOneAndDelete({_id: req.params.id})) {
            return res.status(404).json({
                error: "Provider not found"
            });
        }
        res.status(204).send();
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
}
