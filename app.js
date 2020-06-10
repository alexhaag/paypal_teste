const express = require("express");
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");

const app = express();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "Aas0drE82jJaIyv3dZ_rtcorUQoyJ0loxi6XL2mxXcaRyJSvD698phs0P0wYhP_XaSXq4hR6OtAjtxUq",
  client_secret:
    "ELT18Jc_9LA0fJhognsYHN74bL0_O_73jNrddYoJQYtVhYhL0-3uWZwZC6bRs7ZSszr4bMnwTP7Nu5NW",
});

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhosst:3000/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Bicicleta Bala",
              sku: "item",
              price: "25.00",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "25.00",
        },
        description: "Esta foi considerada a melhor bicicleta do ano.",
      },
    ],
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      //console.log("Create Payment Response");
      //console.log(payment);
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
      res.send();
    }
  });
});

app.listen(3000, () => console.log("Server Started"));
