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

const App = () => {
  const [selectedPage, setSelectedPage] = useState('mirror');
  const [wakeWordIsActive, setWakeWordIsActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  return (
    <div
      className={wakeWordIsActive ? `appContainer appBorder` : `appContainer`}
    >
      <div className="appSubContainer">
        {/* {selectedPage === 'mirror' ? <MirrorUi /> : <p></p>} */}
        <WakeWord
          setVoiceTranscript={setVoiceTranscript}
          setWakeWordIsActive={setWakeWordIsActive}
          wakeWordIsActive={wakeWordIsActive}
        >
          <MirrorUi
            setVoiceTranscript={setVoiceTranscript}
            voiceTranscript={voiceTranscript}
            wakeWordIsActive={wakeWordIsActive}
          />
        </WakeWord>
      </div>
    </div>
  );
};

export default App;
