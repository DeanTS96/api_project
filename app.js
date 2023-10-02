const express = require('express');
const {getTopics} = require('./controllers/topics.controllers');
const getAPIs = require('./controllers/api_docs.controllers')

const app = express();

app.get('/api/topics', getTopics);

app.get('/api', getAPIDocs);

app.use((req, res, next) => {
    console.log('my error')
    res.status(400).send({msg: 'Bad api endpoint'});
})

module.exports = app;