const express = require("express");
const app = express();
require("dotenv").config();
const weatherRouter = require("./routes/weather");

//tells Express that it should accept json
//.use is middleware that allows us to run code when server gets a request but before it gets passed to its route
app.use(express.json());
app.use("/", usersRouter);
app.listen(process.env.PORT || 3000, () => console.log("Server Initiated"));
