const express = require('express');
const {getTopics} = require('./controllers/topics.controllers');
const {getAPIDocs} = require('./controllers/api_docs.controllers');
const {getArticleById, getArticles, patchArticleById} = require('./controllers/articles.controllers');
const handleErrors = require('./errorsControllers/handleErrors.errors.controllers');
const {getUsers} = require('./controllers/users.controllers');
const {getCommentsById, postCommentByArticleId, deleteCommentById} = require('./controllers/comments.controllers');

const app = express();

app.use(express.json());

app.get('/api', getAPIDocs);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', patchArticleById);

app.get('/api/articles/:article_id/comments', getCommentsById);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);
app.delete('/api/comments/:comment_id', deleteCommentById);

app.get('/api/users', getUsers);

app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'Bad api endpoint'});
})

app.use(handleErrors);

module.exports = app;