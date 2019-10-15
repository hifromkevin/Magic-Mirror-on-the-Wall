// exports for App.jsx
const AppLib = require('./AppLib');
exports.apiCalls = AppLib.apiCalls;
exports.weatherInfo = AppLib.weatherInfo;
exports.dateInfo = AppLib.dateInfo;

// exports for DateAndTime.jsx
const DateAndTimeLib = require('./DateAndTimeLib');
exports.getTime = DateAndTimeLib.getTime;