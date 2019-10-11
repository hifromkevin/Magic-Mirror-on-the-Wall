let config = require('../config');

// let getJsonFromUrl = async (url, options) => {
// 		const result = await fetch(url, options);
// 		if (result.ok === false) {
// 			throw result
// 		} else {
// 			return await result.json();
// 		}
// 	}

let dadJokeCall = () => {
	return fetch('https://icanhazdadJoke.com', { headers: { 'Accept': 'application/json' }})
		.then(res => res.json())
		.then(data => data)
		.catch(err => console.log('What do you get when you ask for a dad joke?', err))
}

let newsCall = () => {
	return fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.default.NewsAPI}`)
		.then(res => res.json())
		.then(data => data)
		.catch(err => console.log('Good news? Nothing. Bad news? ', err))
}

let weatherCall = async () => {
	return fetch('https://json.geoiplookup.io/')
					.then(res => res.json())
					.then(data => {
						return fetch(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${data.latitude},${data.longitude}`)
										.then(res => res.json())
										.then(dataWeather => [data, dataWeather])
										.catch(err => console.log('Hey, how is the weather? ', err))
					})
					.catch(err => console.log('No IP for you ', err))
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


exports.weatherTranslator = weatherTranslator;
exports.dadJokeCall = dadJokeCall;
exports.newsCall = newsCall;
exports.weatherCall = weatherCall;
