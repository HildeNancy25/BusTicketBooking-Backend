const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Api is running "));

app.use("/api/users", require("./routers/api/users"));
app.use("/api/book", require("./routers/api/users"));
app.use("/api/auth", require("./routers/api/auth"));
app.use("/api/search", require("./routers/api/searchBus"));
app.use("/api/buses", require("./routers/api/buses"));
app.use("/api/routes", require("./routers/api/route"));
app.use("/api/drivers", require("./routers/api/driver"));
app.use("/api/tickets", require("./routers/api/ticket"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`server is running on port  ${PORT}`));
