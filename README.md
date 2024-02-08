# Magic-Mirror-on-the-Wall
_The UI for my Raspberry Pi magic mirror build_

![Magic Mirror on the Wall](mirror-ui.png?raw=true)

## Requirements

Node (Suggested v21.6.1)
  - https://nodejs.org/en/download/ 
NPM (Suggested v10.2.4)
Electron (Suggested v6.0.3)
  - npm install electron -g

API Keys:
1. Go to the following websites and request an API key:
  - [AccuWeather](https://developer.accuweather.com/apis)
  - [NewsAPI](newsapi.org)
  - [IpInfoAPI](https://ipinfo.io/)
2. The file config/index.example.js has been provided as a template for saving your API keys without exposing them. Copy and paste in your API key, then change the name of the file to index.js and save. 
  - Recommended: In addition, save your API keys in a safe place for reference.

## Open With a Script

(IN PROGRESS)
In terminal from the main directory of this software, you may run
```sh
bash start-app.sh
```

## Running Servers

Open three tabs on your terminal. 
Tab 1: 
```sh
npm install 
npm start
```

Tab 2: 
```sh
npm run build
```

Tab 3: 
```sh
npm run electron
```

## Overview

This is the UI for my Magic Mirror, powered by a Raspberry Pi. This is a UI built to:
- Display the weather with custom icons (made by ME!)
- Display the time and date
- Six recent news headlines
- And, most importantly, a random dad joke