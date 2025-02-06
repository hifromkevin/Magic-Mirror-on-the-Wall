import 'babel-polyfill'; // required for `async` keyword
import React, { useState, useEffect } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import WelcomeText from './DadJoke.jsx';

import { apiCalls, weatherInfo } from '../lib';

const { dadJokeApi, surfApi } = apiCalls;

const MirrorUi = () => {
  const [mirrorInfo, setMirrorInfo] = useState({
    weatherBool: false,
    newsBool: false,
  });
  const [apiText, getApiText] = useState('');
  const [apiResponse, setApiResponse] = useState('');

  const { weatherIcons, weatherTranslator } = weatherInfo;

  const dadJokeAPI = async () => {
    let jokeData = await dadJokeApi();

    setMirrorInfo((state) => ({ ...state, dadJoke: jokeData.joke }));
  };

  const newsAPI = async () => {
    await fetch('/news')
      .then((response) => response.json())
      .then((res) =>
        setMirrorInfo((state) => ({
          ...state,
          news: res.data.slice(0, 6),
          newsBool: true,
        }))
      )
      .catch((error) => console.error('No news is bad news :(', error));
  };

  const getLocationAndWeatherAPI = async () => {
    await fetch('/location')
      .then((response) => response.json())
      .then((res) => {
        const {
          city,
          region,
          currentWeather,
          weatherForecast: { DailyForecasts },
        } = res;

        const [
          {
            Temperature: {
              Imperial: { Value },
            },
            WeatherIcon,
            WeatherText,
          },
        ] = currentWeather;

        setMirrorInfo((state) => ({
          ...state,
          currentWeather: {
            weatherCode: WeatherIcon,
            temperature: Value,
            description: WeatherText,
          },
          location: `${city}, ${region}`,
          forecasts: DailyForecasts.slice(1, 5),
          weatherBool: true,
        }));
      })
      .catch((error) => console.error('Off the grid! :(', error));
  };

  const getSurfReport = async () => {
    let surfData = await surfApi();

    console.log('Surf Data', surfData);
  };

  const fakeWeather = {
    currentWeather: {
      weatherCode: weatherTranslator(1),
      temperature: 70,
      description: 'Sunny',
    },
    location: 'San Francisco, CA',
    forecasts: [
      {
        Date: '2021-10-01T07:00:00-07:00',
        Day: {
          Icon: 1,
          IconPhrase: 'Sunny',
        },
        Temperature: {
          Maximum: {
            Value: 75,
          },
          Minimum: {
            Value: 60,
          },
        },
      },
      {
        Date: '2021-10-02T07:00:00-07:00',
        Day: {
          Icon: 2,
          IconPhrase: 'Partly Cloudy',
        },
        Temperature: {
          Maximum: {
            Value: 70,
          },
          Minimum: {
            Value: 55,
          },
        },
      },
      {
        Date: '2021-10-03T07:00:00-07:00',
        Day: {
          Icon: 3,
          IconPhrase: 'Cloudy',
        },
        Temperature: {
          Maximum: {
            Value: 65,
          },
          Minimum: {
            Value: 50,
          },
        },
      },
      {
        Date: '2021-10-04T07:00:00-07:00',
        Day: {
          Icon: 4,
          IconPhrase: 'Rain',
        },
        Temperature: {
          Maximum: {
            Value: 60,
          },
          Minimum: {
            Value: 45,
          },
        },
      },
    ],
  };

  const getAI = async () => {
    const data = {
      question: apiText,
      weatherData: {
        location: mirrorInfo.location,
        currentWeather: {
          temperature: mirrorInfo.currentWeather.temperature,
          currentWeather: weatherTranslator(
            mirrorInfo.currentWeather.weatherCode
          ),
          description: mirrorInfo.currentWeather.description,
        },
        forecasts: mirrorInfo.forecasts,
      },
    };

    console.log('Data', data);

    try {
      const response = await fetch('/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      setApiResponse(res.answer);
    } catch (error) {
      console.error('AI request failed:', error);
      setApiResponse(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    dadJokeAPI();
    newsAPI();
    // getSurfReport();
    getLocationAndWeatherAPI();
  }, []);

  const {
    currentWeather,
    dadJoke,
    forecasts,
    location,
    news,
    newsBool,
    weatherBool,
  } = mirrorInfo;

  return (
    <div className="main">
      <div className="section">
        <Weather
          currentWeather={currentWeather}
          location={location}
          forecasts={forecasts}
          weatherTranslator={weatherTranslator}
          weatherIcons={weatherIcons}
          weatherBool={weatherBool}
        />
        <div>
          Ask me anything! (About the weather):
          <textarea
            onChange={(e) => getApiText(e.target.value)}
            value={apiText}
          ></textarea>
          <button onClick={getAI}>Show me the answer</button>
          <p>Response: {apiResponse}</p>
        </div>
        <DateAndTime />
      </div>
      <div className="section">
        <WelcomeText dadJoke={dadJoke} />
      </div>
      <div className="section">
        <Headlines news={news} newsBool={newsBool} />
      </div>
    </div>
  );
};
export default MirrorUi;
