const {getArticleById, getArticles, patchArticleById} = require('../controllers/articles.controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchArticleById);

module.exports = articlesRouter;