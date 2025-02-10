import 'babel-polyfill';
import React, { Fragment, useEffect } from 'react';

import { usePorcupine } from '@picovoice/porcupine-react';
import mirrorOnTheWallKeyword from '../assets/porcupine/mirrorOnTheWallKeyword';
import porcupineParams from '../assets/porcupine/porcupine_params';
import { picovoiceAPI } from '../config/index';

const WakeWord = ({ children }) => {
  // DOCS: https://picovoice.ai/docs/quick-start/porcupine-react/
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  const porcupineKeyword = {
    base64: mirrorOnTheWallKeyword,
    label: 'Mirror on the Wall',
  };

  useEffect(() => {
    init(picovoiceAPI, porcupineKeyword, { base64: porcupineParams });
  }, []);

  useEffect(() => {
    start();
  }, [isLoaded]);

  useEffect(() => {
    if (keywordDetection !== null) {
      console.log('himom!', keywordDetection);
    }
  }, [keywordDetection]);

  return (
    <div>
      <p>Is Listening: {JSON.stringify(isListening)}</p>
      <p>Is Loaded: {JSON.stringify(isLoaded)}</p>
      <p>Error: {JSON.stringify(error)}</p>
      {children}
    </div>
  );
};

export default WakeWord;
