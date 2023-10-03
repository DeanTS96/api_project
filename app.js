const express = require('express');
const {getTopics} = require('./controllers/topics.controllers');
const {getAPIDocs} = require('./controllers/api_docs.controllers');
const {getArticleById, getArticles} = require('./controllers/articles.controllers');
const articlesErrors = require('./errorsControllers/articles.errors.controllers');
const {getCommentsById} = require('./controllers/comments.controllers');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsById);

app.get('/api/articles', getArticles);

app.get('/api', getAPIDocs);

app.all('/*', (req, res, next) => {
    console.log('my error')
    res.status(404).send({msg: 'Bad api endpoint'});
})

app.use(articlesErrors);

module.exports = app;