const express = require("express");
const app = express();
require("dotenv").config();
const weatherRouter = require("./routes/weather");
const validator = require("express-validator");

//tells Express that it should accept json
//.use is middleware that allows us to run code when server gets a request but before it gets passed to its route
app.use(validator());
app.use(express.json());
app.use("/", weatherRouter);
app.listen(9000, () => console.log("Server Initiated"));
