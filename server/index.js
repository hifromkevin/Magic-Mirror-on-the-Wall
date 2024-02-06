const express = require('express');
const app = express();
const axios = require('axios');
const port = 3005;

const { AccuWeatherAPI, ipInfoAPI, NewsAPI } = require('../client/src/config/index');

app.use(express.static(__dirname + '/../client/dist'));

app.get('/location', (req, res) => {
  axios.get(`https://ipinfo.io/json?token=${ipInfoAPI}`)
    .then(async (data) => {
      const {
        data: { city, region, postal }
      } = data;

      const getLocationCode = await axios.get(
        `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${AccuWeatherAPI}&q=${postal}`
      );

      const [locationData] = getLocationCode.data;

      const weatherForecast = await axios.get(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationData.Key}?apikey=${AccuWeatherAPI}`
      );

      const currentWeather = await axios.get(
        `http://dataservice.accuweather.com/currentconditions/v1/${locationData.Key}?apikey=${AccuWeatherAPI}`
      );

      res.status(200).send({
        city,
        region,
        weatherForecast: weatherForecast.data,
        currentWeather: currentWeather.data
      });
    })
    .catch(err => console.log('Off the grid :(', err));
});

app.get('/news', (req, res) => {
  axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NewsAPI}`)
    .then(data => res.status(200).send({ data: data.data.articles }))
    .catch(err => console.log('No news is bad news :(', err));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));