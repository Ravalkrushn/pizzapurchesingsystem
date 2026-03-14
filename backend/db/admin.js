const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    admin_id: Number,
    email_id: String,
    pwd:String
}, {
  versionKey: false // Disable the version key
});

const Admin = mongoose.model("admin_info", adminSchema, "admin_info");
module.exports = Admin;