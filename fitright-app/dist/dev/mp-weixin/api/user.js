"use strict";
const api_request = require("./request.js");
const sendLogin = (data) => api_request.request({ url: "/auth/login", method: "POST", data });
const updateFitnessInfo = (data) => api_request.request({ url: "/user/fitness-info", method: "PUT", data });
exports.sendLogin = sendLogin;
exports.updateFitnessInfo = updateFitnessInfo;
