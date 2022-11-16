const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
  busStation1: {
    type: String,
    required: true,
  },
  busStation2: {
    type: String,
    required: true,
  },
  routeNumber: {
    type: Number,
    required: true,
  },
});

module.exports = Route = mongoose.model("Route", RouteSchema);
