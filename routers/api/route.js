const express = require("express");
const Route = require("../../models/Route");
const BusStation = require("../../models/BusStation");
const router = express.Router();

// @route   GET api/routes
// @desc    Get all routes
// @access  Public

router.get("/", async (req, res) => {
  try {
    const routes = await Route.find();
    if (!routes) throw Error("No routes");
    res.status(200).json(routes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/routes/addRoute
// @desc    Create a route
// @access  Public

router.post("/addRoute", async (req, res) => {
  try {
    const { busStation1, busStation2, routeNumber } = req.body;
    let route = new Route({
      busStation1,
      busStation2,
      routeNumber,
    });
    await route.save();
    res.send(route);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/routes/busStations
// @desc    Get all destinations
// @access  Public

router.get("/busStations", async (req, res) => {
  try {
    const stations = await BusStation.find();
    if (!stations) throw Error("No stations");
    res.status(200).json(stations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/routes/addBusStation
// @desc    Add a destination
// @access  Public

router.post("/addBusStation", async (req, res) => {
  try {
    const { name } = req.body;
    let stationExists = await BusStation.findOne({ name });
    if (stationExists) {
      return res.status(400).json({ msg: "Station already exists" });
    }
    let station = new BusStation({
      name,
    });
    await station.save();
    res.send(station);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
