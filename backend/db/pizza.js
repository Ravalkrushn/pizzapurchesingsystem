const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
    pizza_id: Number,
    pizza_name: String,
    description: String,
    price: Number,
    pizza_img: String,
    res_id: Number,
    cat_id: Number,
    pizza_type: String
}, {
  versionKey: false // Disable the version key
});

const Pizza = mongoose.model("pizza_info", pizzaSchema);
module.exports = Pizza;