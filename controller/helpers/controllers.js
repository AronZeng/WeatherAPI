var constants = require("./constants");

var preconditionErrorCheck = function (errors, responseObject) {
  return returnResponse(responseObject, 412, {}, errors[0].msg);
};
var returnResponse = function (responseObject, statusCode, data, message) {
  if (!message) message = constants.statusCode[statusCode.toString()];
  let statusObj = {
    data: data,
    message: message,
  };
  return responseObject.status(statusCode).json(statusObj);
};

module.exports = { preconditionErrorCheck, returnResponse };
