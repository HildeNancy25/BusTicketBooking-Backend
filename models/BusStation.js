const mongoose = require("mongoose");

const BusStationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

module.exports = BusStation = mongoose.model("busStation", BusStationSchema);
