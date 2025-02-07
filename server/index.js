const express = require('express');
const axios = require('axios');
const { OpenAI } = require('openai');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

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
              `http://dataservice.accuweather.com/currentconditions/v1/${Key}?apikey=${AccuWeatherAPI}?details=true`
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
        res.status(400).send(error);
      }
    })
    .catch((err) => {
      console.log('Off the grid :(', err);
      res.status(400).send(err);
    });
});

app.get('/news', (req, res) => {
  axios
    .get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NewsAPI}`)
    .then((data) => res.status(200).send({ data: data.data.articles }))
    .catch((err) => console.log('No news is bad news :(', err));
});

app.post('/clear-audio', (req, res) => {
  const speechFile = path.join(__dirname, '../client/src/assets/speech.mp3');
  fs.open(speechFile, 'w', (err, fd) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    fs.write(fd, '', (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Audio file cleared' });
    });
  });
});

app.post('/ai', async (req, res) => {
  const speechFile = path.join(__dirname, '../client/src/assets/speech.mp3');
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  try {
    const {
      question,
      weatherData: { location, currentWeather, forecasts },
    } = req.body;

    const forecastMap = forecasts
      ?.map(
        (forecast) =>
          `Day ${formatDate(forecast.Date)}. High/Low (F): ${
            forecast.Temperature.Maximum.Value
          }/${forecast.Temperature.Minimum.Value}. Daytime: ${
            forecast.Day.IconPhrase
          } and is it raining? ${forecast.Day.HasPrecipitation}, Nighttime: ${
            forecast.Night.IconPhrase
          }and is it raining? ${forecast.Night.HasPrecipitation}`
      )
      .join('\n');

    console.log('himom?', forecastMap);

    const prompt = `You are an AI-powered Magic Mirror. The location is: ${location}. The current temperature in fahrenheit is: ${currentWeather.temperature}, the weather is ${currentWeather.weatherCode} and the weather forecast is: ${forecastMap}. 
    User asks: "${question}". Respond in a helpful way.
    Only respond with helpful weather-related information. If the question is unrelated to weather, 
    politely say: "I'm here to provide weather updates. Try asking something like 'Should I wear a jacket today?' 
    or 'Will it rain later?'."`;

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: prompt }],
    });

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'echo',
      input: gptResponse.choices[0].message.content,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    res.status(200).json({ answer: gptResponse.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
