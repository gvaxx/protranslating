const Client = require("../models/Client");
const { validationResult } = require("express-validator");

Client.remove({});

exports.getAllClients = async (req, res) => {
  try {
    const clients = (
      await Client.find().sort({ createdAt: -1 })
    ).map((client) => client.toJSON({ transform: true }));
    res.json(clients);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

exports.getClientById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const client = await Client.findOne({ _id: req.params.id });
    if (!client) {
      return res.status(404).json({
        error: "Client not found",
      });
    }
    res.json(client.toJSON({ transform: true }));
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

exports.createClient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const client = new Client(req.body);
    await client.save();
    return res.json(client.toJSON({ transform: true }));
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};

exports.updateClientById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!client) {
      return res.status(404).json({
        error: "Client not found",
      });
    }
    return res.json(client.toJSON({ transform: true }));
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};
exports.deleteClientById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    if (!(await Client.findOneAndDelete({ _id: req.params.id }))) {
      return res.status(404).json({
        error: "Client not found",
      });
    }
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
};
