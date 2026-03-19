
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req,res)=>{
    res.send("server is running");
});

app.use("/api", productRoutes);

app.listen(5000 ,() =>{
    console.log("server started on port 5000");

});
app.get("/products", (req, res) => {
  res.json([
    { name: "Laptop", price: 50000 },
    { name: "Phone", price: 20000 }
  ]);
});

