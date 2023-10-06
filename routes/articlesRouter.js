const {getArticleById, getArticles, patchArticleById, postArticle} = require('../controllers/articles.controllers');
const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.patch('/:article_id', patchArticleById);
articlesRouter.post('/', postArticle);

module.exports = articlesRouter;