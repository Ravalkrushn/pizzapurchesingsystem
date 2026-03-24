require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const sendEmail = require("./sendEmail");

const Admin = require("./db/admin");
const Restaurant = require("./db/restaurant");
const Customer = require("./db/customer");
const Pizza = require("./db/pizza");
const Category = require("./db/category");
const Order = require("./db/order");



const app = express();

app.use(cors({
    origin: ["http://localhost:4200", "http://127.0.0.1:4200"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

let filepath = "";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/public/pizza_img");
    },
    filename: function (req, file, cb) {
        filepath = "PI" + Date.now() + ".png";
        cb(null, filepath);
    }
})

const upload = multer({ storage: storage });

async function connectDb() {
    await mongoose.connect("mongodb://localhost:27017/", {
        dbName: "pizza_purchasing"
    })
    console.log("Mongodb connected");
}

connectDb().catch((err) => {
    console.error(err);
})


app.get("/", function (req, res) {
    res.send("<h1>Hello From Backend Server</h1>");
})

app.post("/res_regis", async function (req, res) {
    let result = await Restaurant.find({ email_id: req.body.email });
    if (result.length == 0) {
        let result2 = await Restaurant.find().sort({ res_id: -1 }).limit(1);
        let newresid = 0;
        if (result2.length == 0) {
            newresid = 1;
        } else {
            newresid = parseInt(result2[0].res_id) + 1;
        }
        let ob1 = new Restaurant({ res_id: newresid, res_name: req.body.name, address: req.body.add, city: req.body.city, mobile_no: req.body.mno, email_id: req.body.email, pwd: req.body.pwd });
        let result3 = await ob1.save();
        
        // Email Notification Logic
        try {
            const message = `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
    <div style="background: linear-gradient(135deg, #f39c12, #d35400); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">🍕 Pizzeria Partners</h1>
    </div>
    <div style="padding: 40px 30px; background-color: #ffffff;">
        <h3 style="color: #333333; font-size: 22px; margin-top: 0;">Hello ${req.body.name},</h3>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            Your restaurant registration is successful! We are excited to partner with you. 
            An admin will review and approve your account shortly. 
            Once approved, you can start adding your delicious pizzas and receiving orders.
        </p>
        <div style="padding: 20px; background-color: #fdf2e9; border-left: 4px solid #f39c12; border-radius: 4px; margin-top: 25px;">
            <p style="margin: 0; color: #d35400; font-weight: bold; font-size: 15px;">Status: <span style="color: #e67e22;">Pending Approval</span></p>
        </div>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
        <p style="color: #888888; font-size: 14px; margin: 0;">© ${new Date().getFullYear()} Pizzeria. All rights reserved.</p>
        <p style="color: #888888; font-size: 12px; margin-top: 5px;">Need help? Contact admin@pizzeria.com</p>
    </div>
</div>
            `;
            await sendEmail({
                email: req.body.email,
                subject: "Restaurant Registration Successful - Pizzeria",
                message: message
            });
            console.log("Registration Email Sent to Restaurant");
        } catch(err) {
            console.log("Email could not be sent:", err.message);
        }

        res.send(result3);
    } else {
        res.send({ "message": "Email Id Already Exists" });
    }
})

app.post("/add_category", async function (req, res) {
    let result = await Category.find().sort({ cat_id: -1 }).limit(1);
    let newcatid = 0;
    if (result.length == 0) {
        newcatid = 1;
    } else {
        newcatid = parseInt(result[0].cat_id) + 1;
    }
    let ob1 = new Category({ cat_id: newcatid, cat_name: req.body.name, cat_type: req.body.type });
    let result2 = await ob1.save();
    res.send(result2);
})

app.get("/fetch_categories", async function (req, res) {
    let result = await Category.find();
    res.send(result);
})

app.delete("/delete_category/:cid", async function (req, res) {
    let result = await Category.deleteOne({ cat_id: parseInt(req.params.cid) });
    res.send(result);
})

app.post("/update_category", async function (req, res) {
    let result = await Category.updateOne({ cat_id: parseInt(req.body.id) }, { $set: { cat_name: req.body.name, cat_type: req.body.type } });
    res.send(result);
})

app.post("/place_order", async function (req, res) {
    let result = await Order.find().sort({ order_id: -1 }).limit(1);
    let neworderid = 0;
    if (result.length == 0) {
        neworderid = 1;
    } else {
        neworderid = parseInt(result[0].order_id) + 1;
    }
    let ob1 = new Order({
        order_id: neworderid,
        customer_id: parseInt(req.body.customer_id),
        parcel_id: parseInt(req.body.parcel_id),
        res_id: parseInt(req.body.res_id),
        items: req.body.items,
        total_amount: parseFloat(req.body.total_amount),
        del_address: req.body.del_address,
        delivery_address: req.body.delivery_address,
        del_moblie_no: req.body.del_moblie_no
    });
    let result2 = await ob1.save();
    res.send(result2);
})

app.get("/fetch_cust_orders/:cid", async function (req, res) {
    let result = await Order.find({ customer_id: parseInt(req.params.cid) });
    res.send(result);
})




app.post("/cust_regis", async function (req, res) {
    let result = await Customer.find({ email_id: req.body.email });
    if (result.length == 0) {
        let result2 = await Customer.find().sort({ customer_id: -1 }).limit(1);
        let newcustid = 0;
        if (result2.length == 0) {
            newcustid = 1;
        } else {
            newcustid = parseInt(result2[0].customer_id) + 1;
        }
        let ob1 = new Customer({ customer_id: newcustid, customer_name: req.body.name, address: req.body.add, city: req.body.city, mobile_no: req.body.mno, email_id: req.body.email, pwd: req.body.pwd });
        let result3 = await ob1.save();
        
        // Email Notification Logic
        try {
            const message = `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 1px solid #eaeaea;">
    <div style="background: linear-gradient(135deg, #ff6b6b, #c0392b); padding: 30px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">🍕 Welcome to Pizzeria!</h1>
    </div>
    <div style="padding: 40px 30px; background-color: #ffffff;">
        <h3 style="color: #333333; font-size: 22px; margin-top: 0;">Hi ${req.body.name},</h3>
        <p style="color: #555555; font-size: 16px; line-height: 1.6;">
            We are thrilled to have you with us! Your customer account has been created successfully. 
            Get ready to explore our delicious menus, find the best restaurants, and order your favorite pizzas with ease.
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:4200" style="background-color: #ff6b6b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Explore Menus Now</a>
        </div>
    </div>
    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
        <p style="color: #888888; font-size: 14px; margin: 0;">© ${new Date().getFullYear()} Pizzeria. All rights reserved.</p>
        <p style="color: #888888; font-size: 12px; margin-top: 5px;">This is an automated message, please do not reply.</p>
    </div>
</div>
            `;
            await sendEmail({
                email: req.body.email,
                subject: "Registration Successful - Welcome to Pizzeria",
                message: message
            });
            console.log("Registration Email Sent to Customer");
        } catch(err) {
            console.log("Email could not be sent:", err.message);
        }

        res.send(result3);
    } else {
        res.send({ "message": "Email Id Already Exists" });
    }
})

app.post("/login_user", async function (req, res) {
    console.log("Login Data Received from Frontend:", req.body);

    // Hardcoded Admin check (agar aapko direct Admin panel test karna ho bina DB me add kiye)
    if (req.body.email === "admin@pizzeria.com" && req.body.pwd === "admin") {
        return res.send({ "message": "Admin Login Successfully" });
    }

    let result = await Admin.findOne({ email_id: req.body.email, pwd: req.body.pwd });
    if (result) {
        return res.send({ "message": "Admin Login Successfully" });
    }

    let result2 = await Restaurant.findOne({ email_id: req.body.email, pwd: req.body.pwd });
    if (result2) {
        return res.send(result2);
    }

    let result3 = await Customer.findOne({ email_id: req.body.email, pwd: req.body.pwd });
    if (result3) {
        return res.send(result3);
    }

    res.send({ "message": "Check Your Email Id Or Password" });
})

app.get("/fetch_resdetail", async function (req, res) {
    let result = await Restaurant.find();
    res.send(result);
})

app.delete("/delete_restaurant/:rid", async function (req, res) {
    let result = await Restaurant.deleteOne({ res_id: parseInt(req.params.rid) });
    res.send(result);
})

app.get("/fetch_single_resdetail/:rid", async function (req, res) {
    let result = await Restaurant.findOne({ res_id: parseInt(req.params.rid) });
    res.send(result);
})

app.post("/update_restaurant", async function (req, res) {
    let result = await Restaurant.updateOne({ res_id: parseInt(req.body.rid) }, { $set: { res_name: req.body.name, address: req.body.add, city: req.body.city, mobile_no: req.body.mno, email_id: req.body.email, pwd: req.body.pwd } });
    res.send(result);
})

app.get("/fetch_custdetail", async function (req, res) {
    let result = await Customer.find();
    res.send(result);
})

app.delete("/delete_customer/:cid", async function (req, res) {
    let result = await Customer.deleteOne({ customer_id: parseInt(req.params.cid) });
    res.send(result);
})

app.get("/fetch_single_custdetail/:cid", async function (req, res) {
    let result = await Customer.findOne({ customer_id: parseInt(req.params.cid) });
    res.send(result);
})

app.post("/update_customer", async function (req, res) {
    let result = await Customer.updateOne({ customer_id: parseInt(req.body.cid) }, { $set: { customer_name: req.body.name, address: req.body.add, city: req.body.city, mobile_no: req.body.mno, email_id: req.body.email, pwd: req.body.pwd } });
    res.send(result);
})



app.post("/rest_add_pizza", upload.single('image'), async function (req, res) {
    const result = await Pizza.find().sort({ pizza_id: -1 }).limit(1);
    let newpizzaid = 0;
    if (result.length == 0) {
        newpizzaid = 1
    } else {
        newpizzaid = parseInt(result[0].pizza_id) + 1;
    }
    let ob1 = new Pizza({ pizza_id: parseInt(newpizzaid), pizza_name: req.body.name, description: req.body.desc, price: parseInt(req.body.price), pizza_img: filepath, res_id: parseInt(req.body.restid), cat_id: parseInt(req.body.catid), pizza_type: req.body.type });
    let result2 = await ob1.save();
    res.send(result2);
})



app.get("/fetch_pizza_detail/:rid", async function (req, res) {
    console.log("Frontend se aayi Restaurant ID:", req.params.rid);
    let result = await Pizza.find({ res_id: parseInt(req.params.rid) });
    console.log("Database me mile Pizzas:", result.length);
    res.send(result);
})

app.delete("/delete_pizza/:pid", async function (req, res) {
    let result = await Pizza.deleteOne({ pizza_id: parseInt(req.params.pid) });
    res.send(result);
})

app.get("/fetch_single_pizza_detail/:pid", async function (req, res) {
    let result = await Pizza.findOne({ pizza_id: parseInt(req.params.pid) });
    res.send(result);
})

app.get("/fetch_rest_orders/:rid", async function (req, res) {
    // Specific restaurant ke orders fetch karne ka route
    let result = await Order.find({ res_id: parseInt(req.params.rid) });
    res.send(result);
})

app.get("/fetch_rest_customers/:rid", async function (req, res) {
    try {
        const rid = parseInt(req.params.rid);
        // Find unique customer IDs that placed orders with this restaurant
        const orderCustomers = await Order.distinct("customer_id", { res_id: rid });
        
        // Fetch full details for these customers
        const customers = await Customer.find({ customer_id: { $in: orderCustomers } });
        res.send(customers);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

app.get("/fetch_rest_orders_enriched/:rid", async function (req, res) {
    try {
        const rid = parseInt(req.params.rid);
        const orders = await Order.find({ res_id: rid });
        
        const enrichedOrders = await Promise.all(orders.map(async (order) => {
            let orderObj = order.toObject();
            let customer = await Customer.findOne({ customer_id: order.customer_id });
            orderObj.customer_name = customer ? customer.customer_name : "Unknown Customer";
            orderObj.item_count = order.items.length;
            return orderObj;
        }));
        
        res.send(enrichedOrders);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})

app.get("/fetch_rest_bills_enriched/:rid", async function (req, res) {
    try {
        const rid = parseInt(req.params.rid);
        // 'Delivered' orders are considered bills
        const bills = await Order.find({ res_id: rid, status: "Delivered" });
        
        const enrichedBills = await Promise.all(bills.map(async (bill) => {
            let billObj = bill.toObject();
            let customer = await Customer.findOne({ customer_id: bill.customer_id });
            billObj.customer_name = customer ? customer.customer_name : "Unknown Customer";
            billObj.bill_date = bill.order_date;
            return billObj;
        }));
        
        res.send(enrichedBills);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
})
app.post("/rest_update_pizza_withimg", upload.single('image'), async function (req, res) {
    let result2 = await Pizza.updateOne({ pizza_id: parseInt(req.body.pizzaid) }, { $set: { pizza_name: req.body.name, description: req.body.desc, price: parseInt(req.body.price), pizza_img: filepath, res_id: parseInt(req.body.restid), cat_id: parseInt(req.body.catid), pizza_type: req.body.type } });
    res.send(result2);
})

app.post("/rest_update_pizza", async function (req, res) {
    let result2 = await Pizza.updateOne({ pizza_id: parseInt(req.body.pizzaid) }, { $set: { pizza_name: req.body.name, description: req.body.desc, price: parseInt(req.body.price), res_id: parseInt(req.body.restid), cat_id: parseInt(req.body.catid), pizza_type: req.body.type } });
    res.send(result2);
})

app.post("/update_order_status", async function (req, res) {
    let result = await Order.updateOne({ order_id: parseInt(req.body.order_id) }, { $set: { status: req.body.status } });
    res.send(result);
})

app.post("/cancel_order", async function (req, res) {
    let result = await Order.updateOne(
        { order_id: parseInt(req.body.order_id), status: "Pending" }, 
        { $set: { status: "Cancelled" } }
    );
    res.send(result);
})

app.post("/submit_rating", async function (req, res) {
    let result = await Order.updateOne(
        { order_id: parseInt(req.body.order_id) }, 
        { $set: { rating: parseInt(req.body.rating) } }
    );
    res.send(result);
})

app.get("/fetch_all_orders", async function (req, res) {
    let orders = await Order.find();
    let enrichedOrders = await Promise.all(orders.map(async (order) => {
        let orderObj = order.toObject();
        let restaurant = await Restaurant.findOne({ res_id: order.res_id });
        let customer = await Customer.findOne({ customer_id: order.customer_id });
        
        orderObj.res_name = restaurant ? restaurant.res_name : "Unknown Restaurant";
        orderObj.customer_name = customer ? customer.customer_name : "Unknown Customer";
        
        // Count items
        orderObj.item_count = order.items.length;
        
        return orderObj;
    }));
    res.send(enrichedOrders);
})

app.get("/fetch_all_bills", async function (req, res) {
    // Orders with status 'Delivered' are considered bills for reporting
    let bills = await Order.find({ status: "Delivered" });
    let enrichedBills = await Promise.all(bills.map(async (bill) => {
        let billObj = bill.toObject();
        let restaurant = await Restaurant.findOne({ res_id: bill.res_id });
        let customer = await Customer.findOne({ customer_id: bill.customer_id });
        
        billObj.res_name = restaurant ? restaurant.res_name : "Unknown Restaurant";
        billObj.customer_name = customer ? customer.customer_name : "Unknown Customer";
        
        // Since schema doesn't have bill_date, we use order_date or current date
        // For existing front-end compatibility, we'll map order_date to bill_date
        billObj.bill_date = bill.order_date;
        
        return billObj;
    }));
    res.send(enrichedBills);
})


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: 'Pizza Order',
                        },
                        unit_amount: req.body.amount * 100, // Amount in paise
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:4200/cust_cart?payment_success=true',
            cancel_url: 'http://localhost:4200/cust_cart',
        });
        res.json({ url: session.url });
    } catch (e) {
        console.error("Stripe Error:", e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(3000, function () {
    console.log("Server Started At Port No 3000");
})
