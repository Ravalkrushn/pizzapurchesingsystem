const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");

const Admin = require("./db/admin");
const Restaurant = require("./db/restaurant");
const Customer = require("./db/customer");
const Pizza = require("./db/pizza");
const Category = require("./db/category");


app = express();

app.use(cors());
app.use(express.urlencoded({extended:false}));
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


app.get("/",function(req,res){
    res.send("<h1>Hello From Backend Server</h1>");
})

app.post("/res_regis",async function(req,res){
    let result = await Restaurant.find({email_id: req.body.email});
    if(result.length==0){
        let result2 = await Restaurant.find().sort({res_id:-1}).limit(1);
        let newresid = 0;
        if(result2.length==0){
            newresid = 1;
        }else{
            newresid = parseInt(result2[0].res_id) + 1;
        }
        let ob1 = new Restaurant({res_id: newresid,res_name: req.body.name,address: req.body.add,city: req.body.city,mobile_no: req.body.mno,email_id:req.body.email,pwd: req.body.pwd});
        let result3 = await ob1.save();
        res.send(result3);
    }else{
        res.send({"message":"Email Id Already Exists"});
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



app.post("/cust_regis",async function(req,res){
    let result = await Customer.find({email_id: req.body.email});
    if(result.length==0){
        let result2 = await Customer.find().sort({customer_id:-1}).limit(1);
        let newcustid = 0;
        if(result2.length==0){
            newcustid = 1;
        }else{
            newcustid = parseInt(result2[0].customer_id) + 1;
        }
        let ob1 = new Customer({customer_id: newcustid,customer_name: req.body.name,address: req.body.add,city: req.body.city,mobile_no: req.body.mno,email_id:req.body.email,pwd: req.body.pwd});
        let result3 = await ob1.save();
        res.send(result3);
    }else{
        res.send({"message":"Email Id Already Exists"});
    }
})

app.post("/login_user",async function(req,res){
    let result = await Admin.findOne({email_id: req.body.email});
    if(result){
        res.send({"message":"Admin Login Successfully"});
    }else{
        let result2 = await Restaurant.findOne({email_id: req.body.email});
        if(result2){
            res.send(result2);
        }else{
            let result3 = await Customer.findOne({email_id: req.body.email});
            if(result3){
                res.send(result3);
            }else{
                res.send({"message": "Check Your Email Id Or Password"});
            }
        }
    }
})

app.get("/fetch_resdetail",async function(req,res){
    let result = await Restaurant.find();
    res.send(result);
})

app.delete("/delete_restaurant/:rid",async function(req,res){
    let result = await Restaurant.deleteOne({res_id: parseInt(req.params.rid)});
    res.send(result);
})

app.get("/fetch_single_resdetail/:rid",async function(req,res){
    let result = await Restaurant.findOne({res_id: parseInt(req.params.rid)});
    res.send(result);
})

app.post("/update_restaurant",async function(req,res){
    let result = await Restaurant.updateOne({res_id: parseInt(req.body.rid)},{$set: {res_name: req.body.name,address: req.body.add,city: req.body.city,mobile_no:req.body.mno,email_id:req.body.email,pwd: req.body.pwd}});
    res.send(result);
})

app.get("/fetch_custdetail",async function(req,res){
    let result = await Customer.find();
    res.send(result);
})

app.delete("/delete_customer/:cid",async function(req,res){
    let result = await Customer.deleteOne({customer_id: parseInt(req.params.cid)});
    res.send(result);
})

app.get("/fetch_single_custdetail/:cid",async function(req,res){
    let result = await Customer.findOne({customer_id: parseInt(req.params.cid)});
    res.send(result);
})

app.post("/update_customer",async function(req,res){
    let result = await Customer.updateOne({customer_id: parseInt(req.body.cid)},{$set: {customer_name: req.body.name,address: req.body.add,city: req.body.city,mobile_no:req.body.mno,email_id:req.body.email,pwd: req.body.pwd}});
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
    let ob1 = new Pizza({ pizza_id: parseInt(newpizzaid), pizza_name: req.body.name, description: req.body.desc,price: parseInt(req.body.price), pizza_img: filepath,res_id: parseInt(req.body.restid), cat_id: parseInt(req.body.catid), pizza_type: req.body.type });
    let result2 = await ob1.save();
    res.send(result2);
})



app.get("/fetch_pizza_detail/:rid",async function(req,res){
    let result = await Pizza.find({res_id: parseInt(req.params.rid)});
    res.send(result);
})

app.delete("/delete_pizza/:pid",async function(req,res){
    let result = await Pizza.deleteOne({pizza_id: parseInt(req.params.pid)});
    res.send(result);
})

app.get("/fetch_single_pizza_detail/:pid",async function(req,res){
    let result = await Pizza.findOne({pizza_id: parseInt(req.params.pid)});
    res.send(result);
})

app.post("/rest_update_pizza_withimg", upload.single('image'), async function (req, res) {
    let result2 = await Pizza.updateOne({ pizza_id: parseInt(req.body.pizzaid)},{$set:{ pizza_name: req.body.name, description: req.body.desc,price: parseInt(req.body.price), pizza_img: filepath,res_id: parseInt(req.body.restid), cat_id: parseInt(req.body.catid), pizza_type: req.body.type }});
    res.send(result2);
})

app.post("/rest_update_pizza", async function (req, res) {
    let result2 = await Pizza.updateOne({ pizza_id: parseInt(req.body.pizzaid)},{$set:{ pizza_name: req.body.name, description: req.body.desc,price: parseInt(req.body.price),res_id: parseInt(req.body.restid), cat_id: parseInt(req.body.catid), pizza_type: req.body.type }});
    res.send(result2);
})


app.listen(3000,"localhost",function(){
    console.log("Server Started At Port No 3000");
})
