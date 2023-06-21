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
    try {
      await fetch('/news')
        .then(response => response.json())
        .then(res => setMirrorInfo(state => (
          {
            ...state,
            news: res.data.slice(0, 6),
            newsBool: true
          })
        ))
        .catch(error => console.error('No news is bad news :(', error))
    } catch (err) {
      console.error('No news is bad news2 :(', error);
    }
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

    console.log('Surf Data', surfData)

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
      <div className='section'>
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
