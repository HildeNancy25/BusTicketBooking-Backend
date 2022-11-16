const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  fare: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    enum: ["Station1", "Station2", "inTransit", "notInService"],
    default: "notInService",
  },
});
module.exports = Buses = mongoose.model("Buses", BusSchema);
