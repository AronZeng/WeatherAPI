const express = require("express");
const req = require("request");
require("dotenv").config();
var {
  preconditionErrorCheck,
  returnResponse,
} = require("./helpers/controllers");

exports.currentWeather = async function (request, response) {
  request.checkParams("city", "City cannot be empty");
  let errors = request.validationErrors();
  if (errors) return preconditionErrorCheck(errors, response);
  console.log(request.params);
  try {
    req(
      process.env.OPEN_WEATHER_URL +
        `weather?q=${request.params.city}&appid=${
          process.env.OPEN_WEATHER_API_KEY
        }&units=${request.query.units || "metric"}`,
      (error, res, body) => {
        if (error) {
          return returnResponse(response, 500, {}, error.message);
        }
        var obj = JSON.parse(body);
        console.log(obj);
        return returnResponse(response, 200, {}, obj);
      }
    );
  } catch (error) {
    return returnResponse(response, 500, {}, error.message);
  }
};
