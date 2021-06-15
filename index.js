require("dotenv").config();
const express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");

mongoose.connect(
  `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.4jrce.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true }
);

// mongoose.connect(
//   `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.4jrce.mongodb.net/test?retryWrites=true&w=majority`,
//   { useNewUrlParser: true }
// );

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static("static"));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });

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
  },
});

const Sale = mongoose.model("Sale", salesSchema);

// app.get("/", (req, res) => {
//   res.send("App is up and running! v3");
// });

app.post("/sale", async (req, res) => {
  try {
    const sale = new Sale(req.body);
    await sale.save();

    res.json(sale);
  } catch (error) {
    console.log(error);
  }
});

app.get("/sales", async (req, res) => {
  try {
    if (!req.query.date) {
      res.send("provide a date");
    }
    const { date } = req.query;
    const re = /(\d*)-(\d*)-(\d*)/;
    const search = re.exec(date);
    const year = parseInt(search[1]);
    const month = parseInt(search[2]) - 1;
    const day = parseInt(search[3]);

    console.log(year, month, day);

    const sales = await Sale.find({
      date: {
        $lt: new Date(year, month, day + 1),
        $gte: new Date(year, month, day),
      },
    });

    if (sales.length === 0) {
      res.send({
        msg: "no transactions for this date",
      });
    } else {
      let total = 0;
      let cash = 0;
      let pin = 0;
      let products = {
        bol1: 0,
        bol2: 0,
        bol3: 0,
      };
      sales.forEach((sale) => {
        total += sale.total;
        if (!sale.pin) cash += sale.total;
        if (sale.pin) pin += sale.total;
        if (sale.products.bol1) products.bol1 += sale.products.bol1;
        if (sale.products.bol2) products.bol2 += sale.products.bol2;
        if (sale.products.bol3) products.bol3 += sale.products.bol3;
      });

      const response = {
        transactions: sales.length,
        total,
        cash,
        pin,
        products,
        sales,
      };

      res.send(response);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
