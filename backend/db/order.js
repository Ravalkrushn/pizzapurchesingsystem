const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_id: Number,
    order_date: { type: Date, default: Date.now },
    parcel_id: Number,
    customer_id: Number,
    res_id: Number,
    items: [
        {
            pizza_id: Number,
            pizza_name: String,
            qty: Number,
            price: Number
        }
    ],
    total_amount: Number,
    del_address: String,
    delivery_address: String,
    del_moblie_no: String,
    status: { type: String, default: "Pending" }
}, {
    versionKey: false
});

const Order = mongoose.model("order_info", orderSchema, "order_info");
module.exports = Order;
