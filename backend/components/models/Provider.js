const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const providerSchema = new Schema({
  name: String,
});
if (!providerSchema.options.toJSON) providerSchema.options.toJSON = {};
providerSchema.options.toJSON.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
  delete ret.createdAt;
  delete ret.updatedAt;
  return ret;
};
const Provider = mongoose.model("Provider", providerSchema);
module.exports = Provider;
