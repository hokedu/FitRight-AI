"use strict";
require("../common/vendor.js");
const api_request = require("./request.js");
const getPostureResult = (id) => api_request.request({ url: `/posture/${id}` });
exports.getPostureResult = getPostureResult;
