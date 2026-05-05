"use strict";
const api_request = require("./request.js");
const uploadVideo = (filePath, exerciseType, onProgress) => {
  return api_request.uploadFile({
    url: "/analysis/upload",
    filePath,
    name: "video",
    formData: exerciseType ? { exercise_type: exerciseType } : {},
    onProgress
  });
};
const getAnalysisResult = (id) => api_request.request({ url: `/analysis/${id}` });
exports.getAnalysisResult = getAnalysisResult;
exports.uploadVideo = uploadVideo;
