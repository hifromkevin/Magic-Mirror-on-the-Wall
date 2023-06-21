const express = require('express');
const app = express();
const axios = require('axios');
const port = 3005;

const config = require('../client/src/config/index');

app.use(express.static(__dirname + '/../client/dist'));

app.get('/news', (req, res) => {
  axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${config.NewsAPI}`)
    .then(data => {
      res.status(200).send({ data: data.data.articles })
    })
    .catch(err => console.log('No news is bad news :(', err));
});

app.listen(port, () => console.log(`Listening on port ${port}!`));