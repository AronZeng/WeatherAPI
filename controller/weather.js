const express = require("express");
const req = require("request");
const moment = require("moment");
const constants = require("./helpers/constants");
const cityList = require("../city.list");
require("dotenv").config();
var {
  preconditionErrorCheck,
  returnResponse,
} = require("./helpers/controllers");

exports.currentWeather = async function (request, response) {
  console.log("GET /currentWeather");
  request.checkParams("city", "City cannot be empty!").trim().notEmpty();
  let errors = request.validationErrors();
  if (errors) return preconditionErrorCheck(errors, response);
  try {
    req(
      process.env.OPEN_WEATHER_URL +
        `weather?id=${request.params.city}&appid=${
          process.env.OPEN_WEATHER_API_KEY
        }&units=${request.query.units || "metric"}`,
      (error, res, body) => {
        if (error) {
          console.log(error);
          return returnResponse(response, 500, {}, error.message);
        }
        var obj = JSON.parse(body);
        let data = {
          city_name: request.params.city,
          unit: request.query.units == "imperial" ? "Ferinheight" : "Celcius",
          day: constants.days[moment().weekday()],
          date: moment().format("MMM Do YYYY"),
          high: obj.main.temp_max,
          low: obj.main.temp_min,
        };
        return returnResponse(response, 200, data, undefined);
      }
    );
  } catch (error) {
    console.log(error);
    return returnResponse(response, 500, {}, error.message);
  }
};

exports.currentAverage = async function (request, response) {
  console.log("GET /currentAverage");
  request.checkParams("cities", "Cities cannot be empty").trim().notEmpty();
  let errors = request.validationErrors();
  if (errors) return preconditionErrorCheck(errors, response);
  try {
    let cities = JSON.parse(request.params.cities);
    let cityIds = "";

    //when calling the API with multiple cities, it requires us to use IDs rather than the names
    for (var i = 0; i < cities.length; i++) {
      let city = cityList.find((city) => {
        return city.name == cities[i];
      });
      if (city && city.id) {
        if (cityIds == "") {
          cityIds = cityIds + city.id;
        } else {
          cityIds = cityIds + "," + city.id;
        }
      }
    }
    req(
      process.env.OPEN_WEATHER_URL +
        `group?id=${cityIds}&appid=${process.env.OPEN_WEATHER_API_KEY}&units=${
          request.query.units || "metric"
        }`,
      (error, res, body) => {
        if (error) {
          console.log(error);
          return returnResponse(response, 500, {}, error.message);
        }
        var obj = JSON.parse(body);
        let sumHighs = 0;
        let sumLows = 0;
        for (var i = 0; i < obj.cnt; i++) {
          sumHighs = sumHighs + obj.list[i].main.temp_max;
          sumLows = sumLows + obj.list[i].main.temp_min;
        }
        let data = {
          cities: cities,
          unit: request.query.units == "imperial" ? "Ferinheight" : "Celcius",
          date: moment().format("MMM Do YYYY"),
          average_high: sumHighs / obj.cnt,
          average_low: sumLows / obj.cnt,
        };
        return returnResponse(response, 200, data, undefined);
      }
    );
  } catch (error) {
    console.log(error);
    return returnResponse(response, 500, {}, error.message);
  }
};

exports.notFound = function (request, response) {
  console.log("404 NOT FOUND");
  return returnResponse(response, 404, {}, "404 NOT FOUND");
};
