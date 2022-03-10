const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51KFFqESAp5XbWMm1grFThvw9mYsHTlYGnNTvyxusc34uVg8BDheGyijnpekAKHpaa3pYLM0EA2y6QhLuZUl96MBK00UuhRUl8b"
);

//app config
const app = express();

//middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

///apiroutes
app.get("/", (request, response) => response.status(200).send("hello world"));
// app.get("/home", (request, response) =>
//   response.status(200).send("Hello Rahul")
// );
// #13
app.post("/payments/create", async (request, response) => {
  const total = request.query.total;
  console.log("Payments request received  BOOM!! for this amount >>>" + total);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total, //subunits of currency
    currency: "usd",
  });
  // OK - Created
  response.status(201).send({
    clientSecret: paymentIntent.client_secret,
  });
});

//listen command
exports.api = functions.https.onRequest(app);
console.log();
