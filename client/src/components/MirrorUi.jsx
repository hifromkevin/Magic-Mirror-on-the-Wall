import 'babel-polyfill'; // required for `async` keyword
import React, { useState, useEffect, useRef } from 'react';

import DateAndTime from './DateAndTime.jsx';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';
import DadJoke from './DadJoke.jsx';

import audioFile from '../assets/speech.mp3';

import { apiCalls, weatherInfo } from '../lib';

const { dadJokeApi, surfApi } = apiCalls;

const MirrorUi = ({ setVoiceTranscript, voiceTranscript }) => {
  const [mirrorInfo, setMirrorInfo] = useState({
    weatherBool: false,
    newsBool: false,
  });
  const [dadJokeText, setDadJokeText] = useState('');
  const [weatherError, setWeatherError] = useState(false);
  const [apiText, getApiText] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [aiIsLoading, setAiIsLoading] = useState(false);
  const audioRef = useRef(new Audio(audioFile));

  const { weatherIcons, weatherTranslator } = weatherInfo;

  const clearAudioFile = async () => {
    try {
      await fetch('/clear-audio', { method: 'POST' });
    } catch (error) {
      console.error('Failed to clear audio file:', error);
    }
  };

  const dadJokeAPI = async () => {
    try {
      let { joke } = await dadJokeApi();
      setDadJokeText(joke);
    } catch (error) {
      console.error('Failed to fetch dad joke:', error);
      setDadJokeText('No dad joke found');
    }
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
        const { city, region, currentWeather, weatherForecast } = res;

        const [
          {
            HasPrecipitation,
            IsDayTime,
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
          forecasts: weatherForecast?.DailyForecasts?.slice(1, 5) || [],
          weatherBool: true,
        }));
      })
      .catch((error) => {
        console.error('Off the grid! :(', error);
        setWeatherError(true);
      });
  };

  const getSurfReport = async () => {
    let surfData = await surfApi();

    console.log('Surf Data', surfData);
  };

  const getAI = async () => {
    setAiIsLoading(true);

    const checkAudioFileExists = async () => {
      try {
        const response = await fetch(audioFile, { method: 'HEAD' });
        return response.ok;
      } catch (error) {
        return false;
      }
    };

    const waitForAudioFile = async (url) => {
      const maxRetries = 100;
      const delay = 5000; // 5000ms
      for (let i = 0; i < maxRetries; i++) {
        if (await checkAudioFileExists()) {
          audioRef.current.src = audioFile;
          audioRef.current.play();
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      console.error('Audio file was not created in time.');
    };

    console.log('Voice Transcript: ', voiceTranscript);

    const data = {
      // question: apiText,
      question: voiceTranscript,
      weatherData: {
        location: mirrorInfo?.location,
        currentWeather: {
          temperature: mirrorInfo?.currentWeather?.temperature,
          currentWeather: weatherTranslator(
            mirrorInfo?.currentWeather?.weatherCode
          ),
          description: mirrorInfo?.currentWeather?.description,
        },
        forecasts: mirrorInfo?.forecasts,
      },
      headlines: mirrorInfo?.news,
    };

    try {
      const response = await fetch('/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const res = await response.json();

      await waitForAudioFile();
      setApiResponse(res.answer);
    } catch (error) {
      console.error('AI request failed:', error);
      setApiResponse(`Error: ${error.message}`);
    } finally {
      setAiIsLoading(false);
    }
  };

  useEffect(() => {
    clearAudioFile();
    dadJokeAPI();
    newsAPI();
    // getSurfReport();
    getLocationAndWeatherAPI();
  }, []);

  useEffect(() => {
    voiceTranscript.length && getAI();
    setVoiceTranscript('');
  }, [voiceTranscript]);

  const { currentWeather, forecasts, location, news, newsBool, weatherBool } =
    mirrorInfo;

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
          weatherError={weatherError}
        />
        {/* <div>
          Ask me anything! (About the weather):
          <textarea
            onChange={(e) => getApiText(e.target.value)}
            value={apiText}
          ></textarea>
          <button onClick={getAI}>Show me the answer</button>
          <p>
            Response: {aiIsLoading ? 'Loading AI response...' : apiResponse}
          </p>
        </div> */}
        <DateAndTime />
      </div>
      <div className="section">
        <DadJoke dadJoke={dadJokeText} />
      </div>
      <div className="section">
        <Headlines news={news} newsBool={newsBool} />
      </div>
    </div>
  );
};
export default MirrorUi;
