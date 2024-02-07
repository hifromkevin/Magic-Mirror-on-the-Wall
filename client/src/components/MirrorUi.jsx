import "babel-polyfill"; // required for `async` keyword
import React, { useState, useEffect } from "react";

import DateAndTime from "./DateAndTime.jsx";
import Headlines from "./Headlines.jsx";
import Weather from "./Weather.jsx";
import WelcomeText from "./DadJoke.jsx";

import { apiCalls, weatherInfo } from "../lib";

const {
  dadJokeApi,
  surfApi,
} = apiCalls;

const MirrorUi = () => {
  const [mirrorInfo, setMirrorInfo] = useState({
    weatherBool: false,
    newsBool: false
  });

  const dadJokeAPI = async () => {
    let jokeData = await dadJokeApi();

    setMirrorInfo((state) => ({ ...state, dadJoke: jokeData.joke }));
  };

  const newsAPI = async () => {
    await fetch('/news')
      .then(response => response.json())
      .then(res => setMirrorInfo(state => (
        {
          ...state,
          news: res.data.slice(0, 6),
          newsBool: true
        })
      ))
      .catch(error => console.error('No news is bad news :(', error));
  };

  const getLocationAndWeatherAPI = async () => {
    await fetch('/location')
      .then(response => response.json())
      .then(res => {
        const {
          city,
          region,
          currentWeather,
          weatherForecast: {
            DailyForecasts
          },
        } = res;

        const [{
          Temperature: {
            Imperial: {
              Value
            }
          },
          WeatherIcon,
          WeatherText
        }] = currentWeather;

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
      .catch(error => console.error('Off the grid! :(', error));
  };

  const getSurfReport = async () => {
    let surfData = await surfApi();

    console.log('Surf Data', surfData);
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
    weatherBool
  } = mirrorInfo;

  const { weatherIcons, weatherTranslator } = weatherInfo;

  return (
    <div className='main'>
      <div className='section'>
        <Weather
          currentWeather={currentWeather}
          location={location}
          forecasts={forecasts}
          weatherTranslator={weatherTranslator}
          weatherIcons={weatherIcons}
          weatherBool={weatherBool}
        />
        <DateAndTime />
      </div>
      <div className='section'>
        <WelcomeText dadJoke={dadJoke} />
      </div>
      <div className='section'>
        <Headlines news={news} newsBool={newsBool} />
      </div>
    </div>
  );
};
export default MirrorUi;
