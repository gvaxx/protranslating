const mongoose = require("mongoose");
const { body } = require("express-validator");
const Provider = require("../models/Provider");

const clientValidator = [
  body("name")
    .not()
    .isEmpty(),
  body("email").isEmail(),
  body("phone")
    .matches("^[0-9]*$")
    .isLength(11),
  body("providers").isArray(),
  body("providers.*.id").custom(async (id, { req }) => {
    if (!id || !mongoose.isValidObjectId(id)) {
      throw new Error("Provider id must be ObjectID");
    }
    if (!(await Provider.findOne({ _id: id }))) {
      throw new Error("Provider is not found");
    }
    return true;
  }),
];
module.exports = clientValidator;
