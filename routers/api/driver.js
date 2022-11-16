const express = require("express");
const Driver = require("../../models/Driver");
const Buses = require("../../models/Buses");
const bcrypt = require("bcryptjs");
const router = express.Router();

// @route   GET api/drivers
// @desc    Get all drivers
// @access  Public

router.get("/", async (req, res) => {
  try {
    const drivers = await Driver.find();
    if (!drivers) throw Error("No buses");
    res.status(200).json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route  POST api/drivers/addDriver
// @desc   Add a new driver
// @access Public

router.post("/addDriver", async (req, res) => {
  try {
    const { name, email, password, busId, gender } = req.body;
    let existingDriver = await Driver.findOne({ email });

    if (existingDriver) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Driver already exists" }] });
    }
    let driver = new Driver({
      name,
      email,
      password,
      busId,
      gender,
    });
    await Buses.findByIdAndUpdate(busId, { driverId: driver._id });
    driver.password = await bcrypt.hash(password, 12);

    await driver.save();
    res.status(200).json(driver);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
