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
    .isLength({ min: 9, max: 11 }),
  body("providers").isArray(),
  body("providers.*.id").custom(async (id, { req }) => {
    if (!id || !mongoose.isValidObjectId(id)) {
      throw new Error("Provider id must be ObjectID");
    }
    console.log(id);
    console.log(await Provider.find());
    console.log(await Provider.findOne({ _id: "6112f06a8149de06657f2517" }));
    if (!(await Provider.findOne({ _id: id }))) {
      throw new Error("Provider is not found");
    }
    return true;
  }),
];
module.exports = clientValidator;
