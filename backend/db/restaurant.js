const mongoose = require("mongoose");

const resSchema = new mongoose.Schema({
    res_id: Number,
    res_name: String,
    address: String,
    city: String,
    mobile_no: String,
    email_id: String,
    pwd:String
}, {
  versionKey: false // Disable the version key
});

const Restaurant = mongoose.model("res_info",resSchema);
module.exports = Restaurant;