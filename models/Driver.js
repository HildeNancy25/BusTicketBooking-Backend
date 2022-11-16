const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
});

module.exports = Driver = mongoose.model("driver", DriverSchema);
