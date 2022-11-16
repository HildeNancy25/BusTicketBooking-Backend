const express = require("express");
const Ticket = require("../../models/Ticket");
const Buses = require("../../models/Buses");
const router = express.Router();
const config = require("../../config/stripe.json");
const STRIPE_SECRET_KEY = config.STRIPE_SECRET_KEY;
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

// @route   GET api/tickets/user/:id
// @desc    Get all ticket of a user
// @access  Public

router.get("/user/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.id });
    if (!tickets) throw Error("Ypu have no tickets");
    return res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/tickets/pay
// @desc   Buy a ticket
// @access Public

router.post("/pay", async (req, res) => {
  try {
    const { busId, userId } = req.body;
    let ticket = new Ticket({
      userId,
      busId,
    });
    const bus = await Buses.findById(busId);
    if (!bus) throw Error("No bus found");
    let price = bus.fare;
    // send email to user
    // let testAccount = await nodemailer.createTestAccount();
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for 465, false for other ports
    //   auth: {
    //     user: testAccount.user, // generated ethereal user
    //     pass: testAccount.pass, // generated ethereal password
    //   },
    // });
    // transporter
    //   .sendMail({
    //     from: "<perfectizihirwe@gmail.com>", // sender address
    //     to: "perfectgiftizihirwe@gmail.com", // list of receivers
    //     subject: "Bus Ticket Booking", // Subject line
    //     text: "Hello, hope you are doing great, your ticket for bus RAB 450 E is EY54H23EV", // plain text body
    //   })
    //   .then((info) => {
    //     console.log(info);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    await ticket.save();
    return res.json({ message: "Ticket booked successfully" });
    // res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
