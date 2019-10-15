let config = require('../config');

let getJsonFromUrl = async (url, options) => {
		const result = await fetch(url, options);
		if (result.ok === false) {
			throw result
		} else {
			return await result.json();
		}
	}

let dadJokeCall = async () => {
  try {
   const jokeResult = await fetch('https://icanhazdadjoke.com', { headers: { 'Accept': 'application/json' }});
   const jokeText = await jokeResult.text();
   const dadJoke = JSON.parse(jokeText);
   return dadJoke;
  } catch (err) {
    console.error('What do you get when you ask for a dad joke? ', err);
  }
}

let newsCall = async () => {
  try {
   const newsData = await getJsonFromUrl(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.default.NewsAPI}`);
   return newsData;
  } catch (err) {
    console.error('Today\'s headline: ', err);
  }
}

let weatherCall = async () => {
  try {
      const { longitude, latitude, city, region } = await getJsonFromUrl(('https://json.geoiplookup.io/'));
      const weatherData = await getJsonFromUrl(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${latitude},${longitude}`);
      return [city, region, weatherData];
  } catch (err) {
    console.error('Hey, how is the weather? ', err);
  }
}

let weatherTranslator = (text, time) => {
	let icon;

	text = text.toLowerCase();

  if (text.includes('partly')) {
		if (time >= 0 && (time <= 5 || time >= 19)) {
			icon = 'cloudyNight';
		} else {
			icon = 'partlyCloudy';	
		}	
	} else if (text.includes('cloudy') ) {
		if (time >= 0 && (time <= 5 || time >= 19)) {
			icon = 'cloudyNight';
		} else {
			icon = 'cloudy';	
		}
	} else if (text.includes('clear') || text.includes('sunny') || text.includes('humid') ) {
		if (time >= 0 && (time <= 5 || time >= 19)) {
			icon = 'clearNight';
		} else {
			icon = 'clear';	
		}
  } else if (text.includes('foggy') || text.includes('fog') || text.includes('overcast')) {
  	icon = 'fog';
  } else if (text.includes('rain') || text.includes('flurries') || text.includes('drizzle') ) {
  	icon = 'rain';
  } else if (text.includes('snow')) {
  	icon = 'snow';
  } else if (text.includes('windy')) {
  	icon = 'wind';
  } else if (text.includes('thunder') || text.includes('lightning')) {
  	icon = 'thunderstorms';
  }

  return icon;
}

let weatherIcons = {
  clear: 'img/sun.png',
  partlyCloudy: 'img/partly-cloudy.png',
  rain: 'img/rain.png',
  cloudy: 'img/cloudy.png',
  snow: 'img/snow.png',
  thunderstorm: 'img/thunderstorms.png',
  wind: 'img/wind.png',
  fog: 'img/fog.png',
  sunrise: '',
  clearNight: 'img/clear-night.png',
  cloudyNight: 'img/cloudy-night.png',
  sleet: '',
  hail: ''
};

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const apiCalls = {
  weather: weatherCall,
  joke: dadJokeCall, 
  news: newsCall 
}

const weatherInfo = {
  weatherTranslator: weatherTranslator,
  weatherIcons: weatherIcons
}

const dateInfo = {
  months: months,
  days: days
}


exports.apiCalls = apiCalls;
exports.weatherInfo = weatherInfo;
exports.dateInfo = dateInfo;


