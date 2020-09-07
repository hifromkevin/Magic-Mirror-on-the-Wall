import "babel-polyfill"; // required for `async` keyword
import React, { Component, useState, useEffect } from "react";

import DateAndTime from "./DateAndTime.jsx";
import Headlines from "./Headlines.jsx";
import Weather from "./Weather.jsx";
import WelcomeText from "./WelcomeText.jsx";

import { apiCalls, weatherInfo, dateInfo } from "../lib";

const App = () => {
  const [mirrorInfo, setMirrorInfo] = useState({
    weatherBool: false,
    newsBool: false,
  });

  const getJsonFromUrl = async (url, options) => {
    const result = await fetch(url, options);
    if (result.ok === false) {
      throw result;
    } else {
      return await result.json();
    }
  };

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
    let [city, weatherData] = await apiCalls.weather();

    const { data } = weatherData;
    const currentWeather = data[0];

    setMirrorInfo((state) => ({
      ...state,
      currentWeather: {
        weatherCode: currentWeather.weather.icon,
        temperature: Math.round(currentWeather.temp * (9 / 5) + 32),
        description: currentWeather.weather.description,
      },
      location: `${city}, ${weatherData.state_code}`,
      forecasts: data.slice(1, 6),
      weatherBool: true,
    }));
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
