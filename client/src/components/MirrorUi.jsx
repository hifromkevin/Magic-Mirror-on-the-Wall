import "babel-polyfill"; // required for `async` keyword
import React, { useState, useEffect } from "react";

import DateAndTime from "./DateAndTime.jsx";
import Headlines from "./Headlines.jsx";
import Weather from "./Weather.jsx";
import WelcomeText from "./DadJoke.jsx";

import {
  apiCalls, weatherInfo, dateInfo
} from "../lib";

const {
  dadJokeApi,
  newsApi,
  surfApi,
  weatherApi
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
    let newsData = await newsApi();

    setMirrorInfo(state => (
      {
        ...state,
        news: newsData.articles.slice(0, 6),
        newsBool: true
      })
    );
  };

  const getWeather = async () => {
    const {
      city,
      region,
      weatherForecast: {
        DailyForecasts
      },
      currentWeather: {
        Temperature: {
          Imperial: {
            Value
          }
        },
        WeatherIcon,
        WeatherText
      }
    } = await weatherApi();

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
    })
    );
  };

  const getSurfReport = async () => {
    let surfData = await surfApi();

    // setMirrorInfo((state) => ({ ...state, surfData }));
  };

  useEffect(() => { dadJokeAPI() }, []);
  useEffect(() => { newsAPI() }, []);
  useEffect(() => { getWeather() }, []);
  useEffect(() => { getSurfReport() }, []);

  const { days, months } = dateInfo;

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
      <div className='top'>
        <Weather
          currentWeather={currentWeather}
          location={location}
          forecasts={forecasts}
          weatherTranslator={weatherTranslator}
          weatherIcons={weatherIcons}
          weatherBool={weatherBool}
        />
        <DateAndTime months={months} days={days} />
      </div>
      <div className='middle'>
        <WelcomeText dadJoke={dadJoke} />
      </div>
      <div className='bottom'>
        <Headlines news={news} newsBool={newsBool} />
      </div>
    </div>
  );
};
export default MirrorUi;
