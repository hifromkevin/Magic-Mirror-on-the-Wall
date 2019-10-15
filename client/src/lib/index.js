const AppLib = require('./AppLib');
exports.apiCalls = AppLib.apiCalls;
exports.weatherInfo = AppLib.weatherInfo;
exports.dateInfo = AppLib.dateInfo;

const DateAndTimeLib = require('./DateAndTimeLib');
exports.getTime = DateAndTimeLib.getTime;