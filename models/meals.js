const mongoose = require("mongoose");
const { Schema } = mongoose;

const mealSchema=new Schema({
   mealId:String,
   userId:String,
   mealCount:Number,
   price:Number,
   date:Date,
   ds:Number
});

module.exports = mongoose.model("meals", mealSchema);