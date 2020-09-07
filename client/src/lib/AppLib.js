let config = require("../config");

let getJsonFromUrl = async (url, options) => {
  const result = await fetch(url, options);
  if (result.ok === false) {
    throw result;
  } else {
    return await result.json();
  }
};

let dadJokeCall = async () => {
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

let newsCall = async () => {
  try {
    const newsData = await getJsonFromUrl(
      `https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.default.NewsAPI}`
    );
    return newsData;
  } catch (err) {
    console.error("Today's headline: ", err);
  }
};

let weatherCall = async () => {
  try {
    const { longitude, latitude, city, region } = await getJsonFromUrl(
      "https://json.geoiplookup.io/"
    );

    const weatherData = await getJsonFromUrl(
      `https://api.weatherbit.io/v2.0/forecast/daily?&lat=/${latitude}&lon=${longitude}&key=${config.default.WeatherBitAPI}`
    );
    return [city, weatherData];
  } catch (err) {
    console.error("Hey, how is the weather? ", err);
  }
};

let weatherTranslator = (weatherCode) => {
  let icon;
  weatherCode = ` ${weatherCode}`;
  const code = weatherCode.substring(1, 4);
  const timeOfDay = weatherCode.substring(weatherCode.length - 1);

  switch (code) {
    case "c01":
      icon = timeOfDay === "d" ? "clear" : "clearNight";
      break;
    case "c02":
    case "c03":
    case "c04":
      icon = timeOfDay === "d" ? "partlyCloudy" : "cloudyNight";
      break;
    case "d01":
    case "d02":
    case "d03":
    case "r01":
    case "r02":
    case "f01":
    case "r04":
    case "r05":
    case "u00":
    case "s05":
    case "s06":
      icon = "rain";
      break;
    case "t01":
    case "t02":
    case "t03":
    case "t04":
    case "t05":
      icon = "thunderstorms";
      break;
    case "s01":
    case "s02":
    case "s03":
    case "s04":
      icon = "snow";
      break;
    default:
      icon = timeOfDay === "d" ? "clear" : "clearNight";
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
  weather: weatherCall,
  joke: dadJokeCall,
  news: newsCall,
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
