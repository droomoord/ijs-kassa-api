require("dotenv").config();
const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.4jrce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const { Schema } = mongoose;
const salesSchema = new Schema({
  products: {
    bol1: {
      type: Number,
      default: 0,
    },
    bol2: {
      type: Number,
      default: 0,
    },
    bol3: {
      type: Number,
      default: 0,
    },
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  pin: {
    type: Boolean,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const Sale = mongoose.model("Sale", salesSchema);

app.get("/", (req, res) => {
  res.send("App is up and running!");
});

app.post("/sale", async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();

    res.send(sale);
  } catch (error) {
    console.log(error);
  }
});

app.get("/sale", async (req, res) => {
  try {
    const sales = await Sale.find();
    res.send(sales);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
