import "babel-polyfill"; // required for `async` keyword
import React, { useState, useEffect } from "react";

import DateAndTime from "./DateAndTime.jsx";
import Headlines from "./Headlines.jsx";
import Weather from "./Weather.jsx";
import WelcomeText from "./WelcomeText.jsx";

import {
  apiCalls, weatherInfo, dateInfo
} from "../lib";

const App = () => {
  const [mirrorInfo, setMirrorInfo] = useState({
    weatherBool: false,
    newsBool: false
  });

  const dadJokeAPI = async () => {
    let jokeData = await apiCalls.joke();

    setMirrorInfo((state) => ({ ...state, dadJoke: jokeData.joke }));
  };

  const newsAPI = async () => {
    let newsData = await apiCalls.news();

    console.log("himom newsData", newsData);

    // setMirrorInfo(state => (
    // 	{
    // 		...state,
    // 		news: newsData.articles.slice(0,6),
    // 		newsBool: true
    // 	})
    // );
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
    } = await apiCalls.weather();

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
    let surfData = await apiCalls.surf();

    // setMirrorInfo((state) => ({ ...state, surfData }));
  };

  useEffect(() => {
    dadJokeAPI();
  }, []);
  useEffect(() => {
    newsAPI();
  }, []);
  useEffect(() => {
    getWeather();
  }, []);
  useEffect(() => {
    getSurfReport();
  }, []);

  return (
    <div className='main'>
      <div className='top'>
        <Weather
          currentWeather={mirrorInfo.currentWeather}
          location={mirrorInfo.location}
          forecasts={mirrorInfo.forecasts}
          weatherTranslator={weatherInfo.weatherTranslator}
          weatherIcons={weatherInfo.weatherIcons}
          forecasts={mirrorInfo.forecasts}
          weatherBool={mirrorInfo.weatherBool}
        />
        <DateAndTime months={dateInfo.months} days={dateInfo.days} />
      </div>
      <div className='middle'>
        <WelcomeText dadJoke={mirrorInfo.dadJoke} />
      </div>
      <div className='bottom'>
        <Headlines news={mirrorInfo.news} newsBool={mirrorInfo.newsBool} />
      </div>
    </div>
  );
};
export default App;
