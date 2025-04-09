const express = require('express');
const axios = require('axios');
const { OpenAI } = require('openai');
const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');

const app = express();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
});

const port = process.env.PORT || 3005;

const {
  AccuWeatherAPI,
  ipInfoAPI,
  NewsAPI,
  openAiAPI,
} = require('../client/src/config/index');

const openai = new OpenAI({ apiKey: openAiAPI });

app.use(express.json());
app.use(express.static(__dirname + '/../client/dist'));

app.get('/location', async (req, res) => {
  try {
    const {
      data: { city, region, postal },
    } = await axios.get(`https://ipinfo.io/json?token=${ipInfoAPI}`);

    const cachedData = await redis.get(`city:${city}`);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    const locationResp = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/postalcodes/search?apikey=${AccuWeatherAPI}&q=${postal}`
    );
    const { Key } = locationResp.data[0];

    const [{ data: weatherForecast }, { data: currentWeather }] =
      await Promise.all([
        axios.get(
          `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${Key}?apikey=${AccuWeatherAPI}`
        ),
        axios.get(
          `http://dataservice.accuweather.com/currentconditions/v1/${Key}?apikey=${AccuWeatherAPI}&details=true`
        ),
      ]);

    const responseData = {
      city,
      region,
      weatherForecast,
      currentWeather,
    };

    await redis.setex(`city:${city}`, 3600, JSON.stringify(responseData));
    res.status(200).send(responseData);
  } catch (error) {
    console.log('Off the grid :(', error);
    res.status(400).send(error);
  }
});

app.get('/news', (req, res) => {
  axios
    .get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${NewsAPI}`)
    .then((data) => res.status(200).send({ data: data.data.articles }))
    .catch((err) => console.log('No news is bad news :(', err));
});

app.post('/clear-audio', async (req, res) => {
  const speechFile = path.join(__dirname, '../client/src/assets/speech.mp3');
  try {
    const statsBefore = await fs.promises.stat(speechFile);
    console.log(`File size before clearing: ${statsBefore.size} bytes`);

    await fs.promises.writeFile(speechFile, '');

    const statsAfter = await fs.promises.stat(speechFile);
    console.log(`File size after clearing: ${statsAfter.size} bytes`);

    res.status(200).json({ message: 'Audio file cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
      headlines,
    } = req.body;

    const forecastMap = forecasts?.length
      ? forecasts
          ?.map(
            (forecast) =>
              `Day ${formatDate(forecast.Date)}. High/Low (F): ${
                forecast.Temperature.Maximum.Value
              }/${forecast.Temperature.Minimum.Value}. Daytime: ${
                forecast.Day.IconPhrase
              } and is it raining? ${
                forecast.Day.HasPrecipitation
              }, Nighttime: ${forecast.Night.IconPhrase}and is it raining? ${
                forecast.Night.HasPrecipitation
              }`
          )
          .join('\n')
      : 'No forecast data available.';

    const headlineMap = headlines?.length
      ? headlines
          ?.map(
            (headline) =>
              `${headline.title} by ${headline.author}. Headline Content: ${
                headline?.content &&
                headline?.content.split(' ').slice(0, 50).join(' ')
              }.`
          )
          .join('\n')
      : 'No news available.';

    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI-powered Magic Mirror. The location is: ${location}. 
          The current temperature in Fahrenheit is: ${currentWeather.temperature}, 
          the weather is ${currentWeather.weatherCode}, and the weather forecast is: ${forecastMap}. 
          You also are aware of recent news: ${headlineMap}. 
    
          Only respond with helpful weather-related or news-related information. 
          If the user asks about a news article, listen for the title or author and read the "Headline Content." 
          If the question is unrelated to weather or news, respond with: 
          "I'm here to provide weather updates and news headlines. Try asking something like 'Should I wear a jacket today?' 
          or 'Will it rain later?', or 'Can you read me the article titled ${headlines[0].title}?'."`,
        },
        { role: 'user', content: question },
      ],
    });

    const responseContent = gptResponse.choices[0].message.content;

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'echo',
      input: responseContent,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);

    // Ensure the file is written completely before sending the response
    const stats = await fs.promises.stat(speechFile);
    if (stats.size > 0) {
      console.log(`File size after writing: ${stats.size} bytes`);
      res.status(200).json({ answer: responseContent });
    } else {
      throw new Error('Audio file is empty');
    }
  } catch (error) {
    console.log('The humans win: ', error.response?.data || error.message);

    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
