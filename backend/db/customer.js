const mongoose = require("mongoose");

const custSchema = new mongoose.Schema({
    customer_id: Number,
    customer_name: String,
    address: String,
    city: String,
    mobile_no: String,
    email_id: String,
    pwd:String
}, {
  versionKey: false // Disable the version key
});

const Customer = mongoose.model("customer_info", custSchema);
module.exports = Customer;