const express = require("express");
const request = require("request");
require("dotenv").config();
var {
  preconditionErrorCheck,
  returnResponse,
} = require("./helpers/controllers");

exports.currentWeather = async function (request, response) {
  request.checkParams("city", "City cannot be empty");
  let errors = request.validationErrors();
  if (errors) return preconditionErrorCheck(errors, response);

  try {
    request(
      process.env.OPEN_WEATHER_URL +
        `weather?q=${request.params.city}&appid=${process.env.OPEN_WEATHER_API_KEY}`,
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
