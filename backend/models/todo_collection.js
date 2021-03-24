const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
  name: {type: String, required: true},
  todos: [{type: Schema.Types.ObjectId, ref: "Todo"}]
});

module.exports = collectionSchema;