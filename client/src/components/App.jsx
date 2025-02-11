import 'babel-polyfill';
import React, { useState, useEffect } from 'react';

import MirrorUi from './MirrorUi.jsx';
import WakeWord from './WakeWord.jsx';

// const SpeechRecognition =
//   window.SpeechRecognition || window.webkitSpeechRecognition;
// const mic = new SpeechRecognition();

// mic.start();
// mic.continuous = true;
// mic.interimResults = true;
// mic.lang = 'en-US';

// navigator.mediaDevices.getUserMedia({ audio: true });

const App = () => {
  const [selectedPage, setSelectedPage] = useState('mirror');

  // const voiceControl = () => {
  //   mic.onspeechstart = () => {
  //     console.log('Speech started.');
  //   };

  //   mic.onresult = (e) => {
  //     let current = e.resultIndex;

  //     const transcript = e.results[current][0].transcript;
  //     console.log('Spoken word: ', transcript);

  //     if (transcript === 'magic mirror on the wall') {
  //       setSelectedPage('mirror');
  //     }

  //     mic.onspeechend = () => {
  //       mic.stop();
  //       console.log('Voice stopped.');
  //     };
  //   };
  // };

  // useEffect(voiceControl, []);

  return (
    <div className="appContainer">
      <div className="appSubContainer">
        {/* {selectedPage === 'mirror' ? <MirrorUi /> : <p></p>} */}
        <WakeWord>
          <MirrorUi />
        </WakeWord>
      </div>
    </div>
  );
};

export default App;
