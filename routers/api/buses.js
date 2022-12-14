const express = require("express");
const auth = require("../../middleware/auth");
const Buses = require("../../models/Buses");
const Route = require("../../models/Route");
const BusStation = require("../../models/BusStation");
const Driver = require("../../models/Driver");
const router = express.Router();

// @route   GET api/buses
// @desc    Get all buses
// @access  Public

router.get("/", async (req, res) => {
  try {
    const buses = await Buses.find();
    if (!buses) throw Error("No buses");
    res.status(200).json(buses);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

// @route  POST api/buses
// @desc   Add a new bus
// @access Public

router.post("/addBus", async (req, res) => {
  try {
    const { name, company, routeId, fare } = req.body;

    let bus = new Buses({
      name,
      company,
      routeId,
      fare,
    });
    await bus.save();
    res.send(bus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route UPDATE api/buses/updatePosition/:id
// @desc Update bus position
// @access Public

router.patch("/updatePosition/:id", async (req, res) => {
  try {
    const { position } = req.body;
    let bus = await Buses.findById(req.params.id);
    if (!bus) throw Error("No bus found");
    bus.position = position;
    await bus.save();
    res.send(bus);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route  GET api/busBasedOnRouteAndDestination
// @desc   Get a bus based on route and busStation
// @access Public

router.post("/activeBuses", async (req, res) => {
  try {
    const { routeId, destinationStationId } = req.body;
    const bus = await Buses.find({ routeId: routeId });
    if (!bus) throw Error("No bus found");
    const busStation = await BusStation.find({ _id: destinationStationId });
    const route = await Route.find({ _id: routeId });
    if (busStation[0]?.name === route[0].busStation1) {
      const availableBuses = await Buses.find({ position: "Station2" });
      if (availableBuses.length === 0) {
        return res.status(400).json({ msg: "No buses available" });
      } else {
        return res.status(200).json({ data: availableBuses });
      }
    }
    if (busStation[0]?.name === route[0].busStation2) {
      const availableBuses = await Buses.find({ position: "Station1" });
      if (availableBuses.length === 0) {
        return res.status(400).json({ msg: "No buses available" });
      } else {
        return res.status(200).json({ data: availableBuses });
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(300).send("Server Error");
  }
});

// @route  DELETE api/buses/:id
// @desc   Delete a bus
// @access Public

router.delete("/:id", async (req, res) => {
  try {
    const bus = await Buses.findById(req.params.id);
    if (!bus) throw Error("No bus found");
    const removed = await bus.remove();
    if (!removed)
      throw Error("Something went wrong while trying to delete the bus");
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ msg: error.message, success: false });
  }
});

module.exports = router;
