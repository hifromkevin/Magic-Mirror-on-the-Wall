const express = require('express');
const axios = require('axios');
const { OpenAI } = require('openai');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();

const port = 3005;

const {
  AccuWeatherAPI,
  ipInfoAPI,
  NewsAPI,
  openAiAPI,
} = require('../client/src/config/index');

const openai = new OpenAI({ apiKey: openAiAPI });

app.use(express.json());
app.use(express.static(__dirname + '/../client/dist'));

app.get('/location', (req, res) => {
  axios
    .get(`https://ipinfo.io/json?token=${ipInfoAPI}`)
    .then(async (localeData) => {
      const {
        data: { city, region, postal },
      } = localeData;

      const cachedData = await redis.get(`city:${city}`);
      if (cachedData) {
        console.log('✅ Serving from Redis cache');
        return res.json(JSON.parse(cachedData));
      }

      try {
        const getLocationCode = await axios.get(
          `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${AccuWeatherAPI}&q=${postal}`
        );

        const [locationData] = getLocationCode.data;
        const { Key } = locationData;

        const [{ data: weatherForecast }, { data: currentWeather }] =
          await Promise.all([
            axios.get(
              `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${Key}?apikey=${AccuWeatherAPI}`
            ),
            axios.get(
              `http://dataservice.accuweather.com/currentconditions/v1/${Key}?apikey=${AccuWeatherAPI}`
            ),
          ]);

        const responseData = {
          city,
          region,
          weatherForecast,
          currentWeather,
        };

        await redis.setex(`city:${city}`, 600, JSON.stringify(responseData));

        res.status(200).send(responseData);
      } catch (error) {
        console.log('Raindrops keep falling on my head: ', err);
      }
    })
    .catch((err) => console.log('Off the grid :(', err));
});

app.get('/news', (req, res) => {
  axios
    .get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NewsAPI}`)
    .then((data) => res.status(200).send({ data: data.data.articles }))
    .catch((err) => console.log('No news is bad news :(', err));
});

app.post('/ai', async (req, res) => {
  console.log('himom!', req.body);
  try {
    const {
      question,
      weatherData: { location, currentWeather, forecast },
    } = req.body;

    console.log('himom', currentWeather);

    const prompt = `You are an AI-powered Magic Mirror. The location is: ${location}. The current temperature in fahrenheit is: ${currentWeather.temperature}, the weather is ${currentWeather.weatherCode} and the weather forecast is: ${forecast}. 
    User asks: "${question}". Respond in a helpful way.
    Only respond with helpful weather-related information. If the question is unrelated to weather, 
    politely say: "I'm here to provide weather updates. Try asking something like 'Should I wear a jacket today?' 
    or 'Will it rain later?'."`;

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: prompt }],
    });

    res.json({ answer: gptResponse.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'AI request failed' });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
