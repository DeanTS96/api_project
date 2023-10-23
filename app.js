const express = require('express');
const cors = require('cors');
const handleErrors = require('./errorsControllers/handleErrors.errors.controllers');
const {apiRouter, topicsRouter, articlesRouter, commentsRouter, usersRouter} = require('./routes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/articles', articlesRouter);
app.use(/^\/api\/(comments|articles)/, commentsRouter);
app.use('/api/users', usersRouter);
app.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'Bad api endpoint'});
})

app.use(handleErrors);

module.exports = app;