const express = require('express');
const {getTopics} = require('./controllers/topics.controllers');

const app = express();

app.get('/api/topics', getTopics);

app.use((req, res, next) => {
    console.log('my error')
    res.status(400).send({msg: 'Bad api endpoint'});
})

module.exports = app;