let config = require("../config");

let getJsonFromUrl = async (url, options) => {
  const result = await fetch(url, options);
  if (result.ok === false) {
    throw result;
  } else {
    return await result.json();
  }
};

let dadJokeApi = async () => {
  try {
    const jokeResult = await fetch("https://icanhazdadjoke.com", {
      headers: { Accept: "application/json" },
    });
    const jokeText = await jokeResult.text();
    const dadJoke = JSON.parse(jokeText);
    return dadJoke;
  } catch (err) {
    console.error("What do you get when you ask for a dad joke? ", err);
  }
};

let surfApi = async () => {
  try {
    const surfData = await getJsonFromUrl(
      `http://magicseaweed.com/api/${config.SurfAPI}/forecast/?spot_id=819`
    ); // this is for Linda Mar, Pacifica, CA

    return surfData;
  } catch (err) {
    console.error("WIPEOUT: ", err);
  }
};

let weatherApi = async () => {
  try {
    const { city, region, postal } = await getJsonFromUrl(`https://ipinfo.io/json?token=${config.ipInfoAPI}`);

    const [getLocationCode] = await getJsonFromUrl(
      `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${config.AccuWeatherAPI}&q=${postal}`
    );

    const weatherForecast = await getJsonFromUrl(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${getLocationCode.Key}?apikey=${config.AccuWeatherAPI}`
    );

    const [currentWeather] = await getJsonFromUrl(
      `http://dataservice.accuweather.com/currentconditions/v1/${getLocationCode.Key}?apikey=${config.AccuWeatherAPI}`
    );

    /* USE D3 CHARTS TO SHOW WEATHER!!!!! */

    return {
      city,
      region,
      weatherForecast,
      currentWeather
    }
  } catch (err) {
    console.error("Hey, how is the weather? ", err);
  }
};

let weatherTranslator = (weatherCode) => {
  let icon;

  //reference: https://developer.accuweather.com/weather-icons

  switch (weatherCode) {
    case 1:
    case 2:
    case 30:
    case 31:
      icon = "clear";
      break;
    case 33:
    case 34:
      icon = "clearNight";
      break;
    case 3:
    case 4:
    case 5:
    case 6:
      icon = "partlyCloudy";
      break;
    case 35:
    case 36:
      icon = "cloudyNight";
      break;
    case 7:
    case 8:
    case 20:
    case 21:
    case 38:
      icon = "cloudy";
      break;
    case 11:
    case 37:
      icon = "fog";
      break;
    case 12:
    case 13:
    case 14:
    case 18:
    case 19:
    case 39:
    case 40:
      icon = "rain";
      break;
    case 15:
    case 16:
    case 17:
    case 41:
    case 42:
      icon = "thunderstorms";
      break;
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 29:
    case 43:
    case 44:
      icon = "snow";
      break;
    case 32:
      icon = "wind";
      break;
    default:
      icon = "clear";
      break;
  }

  return icon;
};

let weatherIcons = {
  clear: "img/sun.png",
  partlyCloudy: "img/partly-cloudy.png",
  rain: "img/rain.png",
  cloudy: "img/cloudy.png",
  snow: "img/snow.png",
  thunderstorms: "img/thunderstorms.png",
  wind: "img/wind.png",
  fog: "img/fog.png",
  sunrise: "",
  clearNight: "img/clear-night.png",
  cloudyNight: "img/cloudy-night.png",
  sleet: "",
  hail: "",
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const apiCalls = {
  dadJokeApi,
  surfApi,
  weatherApi
};

const weatherInfo = {
  weatherTranslator: weatherTranslator,
  weatherIcons: weatherIcons,
};

const dateInfo = {
  months: months,
  days: days,
};

exports.apiCalls = apiCalls;
exports.weatherInfo = weatherInfo;
exports.dateInfo = dateInfo;
