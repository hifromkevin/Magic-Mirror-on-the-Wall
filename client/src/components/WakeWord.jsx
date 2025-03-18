import React, { useEffect, useState } from 'react';
import { usePorcupine } from '@picovoice/porcupine-react';

import porcupineKeyword from '../config/wakeWord/PorcupineKeyword';
import porcupineModel from '../config/wakeWord/PorcupineModel';

import { picovoiceAPI } from '../config/index';

const WakeWord = ({ setVoiceTranscript, setWakeWordIsActive, children }) => {
  const { keywordDetection, init, release, start, stop } = usePorcupine();
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [silenceTimeout, setSilenceTimeout] = useState(null);

  const handleSpeechRecognition = () => {
    const recognition =
      new window.webkitSpeechRecognition() || new window.SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    const resetSilenceTimeout = () => {
      if (silenceTimeout) {
        clearTimeout(silenceTimeout);
      }
      setSilenceTimeout(
        setTimeout(() => {
          recognition.stop();
        }, 3000)
      );
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        setVoiceTranscript((prev) => prev + ' ' + lastResult[0].transcript);
      }
      resetSilenceTimeout();
    };

    recognition.onend = () => {
      setIsTranscribing(false);
      setWakeWordIsActive(false);
    };

    recognition.onerror = (err) => {
      console.error('Speech recognition error:', err);
    };

    recognition.start();
    setIsTranscribing(true);
  };

  useEffect(() => {
    if (keywordDetection !== null) {
      setWakeWordIsActive(true);
      handleSpeechRecognition();
    }
  }, [keywordDetection]);

  useEffect(() => {
    const startup = async () => {
      if (!picovoiceAPI || !porcupineKeyword || !porcupineModel) {
        console.error('Missing required parameters for WakeWord component');
        return;
      }

      await init(picovoiceAPI, porcupineKeyword, porcupineModel);
      await start();
    };

    startup();

    return () => stop();
  }, []);

  return <>{children}</>;
};

export default WakeWord;
