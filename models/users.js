/** @format */

const mongoose = require("mongoose");
const { Schema } = mongoose;

const jvSchema = new Schema({
  u_id: { type: String, default:new Date().now },
  uname: { type: String, default: "" },
  password: { type:String,default:""}
});

module.exports = mongoose.model("users", jvSchema);