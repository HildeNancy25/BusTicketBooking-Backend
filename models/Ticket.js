const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Buses,
  },
  boardingPoint: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = Ticket = mongoose.model("ticket", TicketSchema);
