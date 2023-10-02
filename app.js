const express = require('express');
const {getTopics} = require('./controllers/topics.controllers');
const {getAPIDocs} = require('./controllers/api_docs.controllers')

console.log(getAPIDocs);

const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getAPIDocs);

app.all('/*', (req, res, next) => {
    console.log('my error')
    res.status(404).send({msg: 'Bad api endpoint'});
})

module.exports = app;