import 'babel-polyfill';
import React, { Fragment, useEffect } from 'react';

import { usePorcupine } from '@picovoice/porcupine-react';
import mirrorOnTheWall from '../assets/porcupine/mirrorOnTheWall';
import porcupineParams from '../assets/porcupine/porcupineParams';
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
    base64: mirrorOnTheWall,
    label: 'Mirror on the Wall',
  };
  const porcupineModel = { base64: porcupineParams };

  useEffect(() => {
    // NOTE: I think this is failing due to using API Key in demo (hence using my 1 license)
    const initialize = async () =>
      await init(picovoiceAPI, [porcupineKeyword], porcupineModel);
    initialize();
  }, []);

  useEffect(() => {
    console.log('himom! you are here');
    const startPorcupine = async () => await start();
    startPorcupine();
  }, [isLoaded]);

  // useEffect(() => {
  //   // if (keywordDetection !== null) {
  //   //   console.log('himom keywordDetection!', keywordDetection);
  //   // }
  //   // console.log('himom keywordDetection!2', keywordDetection);
  //   // start();
  // }, [keywordDetection]);

  return (
    <div>
      <p>Is Listening: {JSON.stringify(isListening)}</p>
      <p>Is Loaded: {JSON.stringify(isLoaded)}</p>
      {console.log('himom error!', error)}

      {children}
    </div>
  );
};

export default WakeWord;
