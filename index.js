const express = require("express");
const ejs = require("ejs");
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "Aas0drE82jJaIyv3dZ_rtcorUQoyJ0loxi6XL2mxXcaRyJSvD698phs0P0wYhP_XaSXq4hR6OtAjtxUq",
  client_secret:
    "ELT18Jc_9LA0fJhognsYHN74bL0_O_73jNrddYoJQYtVhYhL0-3uWZwZC6bRs7ZSszr4bMnwTP7Nu5NW",
});

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => res.render("index"));

app.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      //return_url: "http://localhost:3000/success",
      //cancel_url: "http://localhost:3000/cancel",
      return_url: "http://haag.com.br/success",
      cancel_url: "http://haag.com.br/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Bicicleta Bala",
              sku: "item",
              price: "25.00",
              currency: "BRL",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "BRL",
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
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
      res.send("");
    }
  });
});

app.get("/success", (req, res) => {
  const paymentInfo = {
    payerId: req.query.PayerID,
    paymentId: req.query.paymentId,
  };

  const execute_payment_json = {
    payer_id: paymentInfo.payerId,
    transactions: [
      {
        amount: {
          currency: "BRL",
          total: "25.00",
        },
      },
    ],
  };

  paypal.payment.execute(paymentInfo.paymentId, execute_payment_json, function (
    err,
    payment
  ) {
    if (err) console.error("Erro aqui ----> ", err);
    res.send("PAGAMENTO EFETUADOOO...!!!!");
  });
});

app.get("/cancel", (req, res) => res.send("FOI CANCELADOOO...!!!"));

const port = process.env.PORT || 3000;
app.listen(3000, () => console.log("Server Started na porta: %s", port));
