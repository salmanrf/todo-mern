const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String},
  priority: {type: Number},
  due_date: {type: Date},
  complete: {type: Boolean, default: false}
});

module.exports = todoSchema;