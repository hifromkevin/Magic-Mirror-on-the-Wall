// let config = require('../config');

// console.log('¿config?', config)

// let hardcodeCoords = () => {
// 	let lat = 38.0296;
// 	let lon = -121.9799;
// 	let weather = getWeather(lat,lon);
// 	console.log('el weather', weather)
// 	return weather.then(result => result);
// }

// let getWeather = (lat,lon) => {
// 	return fetch(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${lat},${lon}`)
// 		.then(res => res.json())
// 		.then(data => {
// 			console.log('¡!', data)
// 			return data;
// 			this.setState({
// 				currentWeather: {
// 					weather: data.currently.summary,
// 					location: 'Concord, CA',
// 					temperature: Math.round(data.currently.temperature),
// 					description: data.hourly.summary					
// 				}
// 			})
// 		})
// 		.catch(err => console.log(err));
// }


// async function getWeather(lat,lon) {
// 	const res = await fetch(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${lat},${lon}`, {});
// 	const data = await res.json();

// 	console.log('¿data?', data);

// 	return data;
// }

// async function hardcodeCoords() {
// 	let lat = 38.0296;
// 	let lon = -121.9799;
//    try {
//      const res = await fetch(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${lat},${lon}`);
//      const data = await res.json();
//      return data;
// 	} catch (err) {
// 	  console.log(err)
// 	}
// }


// exports.hardcodeCoords = hardcodeCoords;



// async function hey() {
// 	let lat = 38.0296;
// 	let lon = -121.9799;
//    try {
//      const res = await fetch(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${lat},${lon}`)
//      console.log('ffff',res);
//       const data = await res.json();
//       console.log('*****', data);
//      return data;
//    }
//    catch (err) {
//         console.log(err)
//    }
// }

// console.log('asfqwe', hey());




// let getWeather = (lat,lon) => {
// 	return fetch(`https://api.darksky.net/forecast/${config.default.DarkSkyAPI}/${lat},${lon}`)
// 		.then(res => res.json())
// 		.then(data => data)
// 		.then(fruit => fruit)
// 		.catch(err => console.log(err));
// }

// 	let lat = 38.0296;
// 	let lon = -121.9799;

// let hi = getWeather(lat,lon);

// console.log('oof', hi.PromiseValue);


// function getUserDataAsync(lat,lon) {
//     return new Promise(function(resolve, reject) {
//         getWeather(lat,lon, resolve, reject);
//     });
// }

// console.log('oh boy', getUserDataAsync(lat,lon));


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

