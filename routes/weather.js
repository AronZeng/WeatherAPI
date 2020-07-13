var express = require("express");
var router = express.Router();

router.get("/current/:city?", require("../controller/weather").currentWeather);
router.get(
  "/average/:cities?",
  require("../controller/weather").currentAverage
);
router.get("/", require("../controller/weather").notFound);

module.exports = router;
