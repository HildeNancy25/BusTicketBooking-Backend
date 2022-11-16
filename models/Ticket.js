const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

module.exports = Ticket = mongoose.model("ticket", TicketSchema);
