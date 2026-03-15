const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    cat_id: Number,
    cat_name: String,
    cat_type: String // Veg or Non-Veg
}, {
    versionKey: false
});

const CategoryMaster = mongoose.model("category_master", categorySchema);
module.exports = CategoryMaster;
