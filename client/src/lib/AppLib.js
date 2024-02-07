const config = require("../config");

const getJsonFromUrl = async (url, options) => {
  const result = await fetch(url, options);
  if (result.ok === false) {
    throw result;
  } else {
    return await result.json();
  }
};

const dadJokeApi = async () => {
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

const surfApi = async () => {
  try {
    const surfData = await getJsonFromUrl(
      `http://magicseaweed.com/api/${config.SurfAPI}/forecast/?spot_id=819`
    ); // this is for Linda Mar, Pacifica, CA

    return surfData;
  } catch (err) {
    console.error("WIPEOUT: ", err);
  }
};

const weatherTranslator = (weatherCode) => {
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

const weatherIcons = {
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

const apiCalls = {
  dadJokeApi,
  surfApi,
};

const weatherInfo = {
  weatherTranslator,
  weatherIcons,
};

exports.apiCalls = apiCalls;
exports.weatherInfo = weatherInfo;
