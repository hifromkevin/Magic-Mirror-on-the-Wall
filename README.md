# Magic-Mirror-on-the-Wall
_The UI for my Raspberry Pi magic mirror build_

![Magic Mirror on the wall](mirror-ui.png?raw=true)

## Requirements
Node (Suggested v11.13.0)
  - https://nodejs.org/en/download/ 

NPM (Suggested v6.12.0)
Electron (Suggested v6.0.3)
  - npm install electron -g

API Keys:
1. Go to the following websites and request an API key:
  - darksky.net
  - newsapi.org
2. Go to config/index.example.js and paste in your API key. Then, change the name of the file to index.js. 

## Installing Dependencies
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