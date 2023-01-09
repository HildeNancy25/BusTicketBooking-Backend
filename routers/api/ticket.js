const express = require("express");
const Ticket = require("../../models/Ticket");
const User = require("../../models/Users");
const Buses = require("../../models/Buses");
const router = express.Router();
var Paypack = require("paypack-js");
Paypack.config({
  client_id: "cc56cc3e-8e9f-11ed-a3eb-dead986dd4f7",
  client_secret:
    "8a3f9ea4b510b0c8dc2a10fbf4fd43dbda39a3ee5e6b4b0d3255bfef95601890afd80709",
});

// @route   GET api/tickets/user/:id
// @desc    Get all ticket of a user
// @access  Public

router.get("/user/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.id, active: true })
      .populate({ path: "busId", populate: { path: "driverId" } })
      .populate("userId");
    if (!tickets) throw Error("You have no tickets");
    return res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/tickets/purchaseHistory/:id
// @desc    Get all used tickets of a user
// @access  Public

router.get("/purchaseHistory/:id", async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.id, active: false })
      .populate({ path: "busId", populate: { path: "driverId" } })
      .populate("userId");
    if (!tickets) throw Error("You have no tickets");
    return res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/tickets/getPassengers
// @desc   Driver to get all passengers
// @access Public

router.get("/getPassengers/:busId", async (req, res) => {
  try {
    const { busId } = req.params;
    const passengers = await Ticket.find({ busId, active: true })
      .populate({ path: "busId", populate: { path: "driverId" } })
      .populate("userId");
    return res.json({ passengers });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route  GET api/tickets/ticketUsed
// @desc   Driver to mark ticket as used
// @access Public

router.get("/ticketUsed/:ticketId", async (req, res) => {
  try {
    const { ticketId } = req.params;
    await Ticket.findOneAndUpdate({ _id: ticketId }, { active: false });
    return res.json({ message: "Ticket used" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

// @route  POST api/tickets/pay
// @desc   Buy a ticket
// @access Public

router.post("/pay", async (req, res) => {
  try {
    const { busId, userId, boardingPoint } = req.body;
    let ticketExists = await Ticket.findOne({
      busId,
      userId,
      active: true,
    });
    if (ticketExists) {
      return res.json({ message: "Ticket already exists" });
    }
    let user = await User.findById(userId);
    let bus = await Buses.findById(busId);
    Paypack.cashin({
      number: user.contact,
      amount: bus.fare,
      environment: "development",
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    let ticket = new Ticket({
      userId,
      busId,
      boardingPoint,
    });
    await ticket.save();
    return res.json({ message: "Confirm payment to finish" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
