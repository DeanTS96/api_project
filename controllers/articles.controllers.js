const {fetchArticleById, fetchArticles} = require('../models/articles.models')

function getArticleById(req, res, next) {
    fetchArticleById(req.params).then((article) => {
        res.status(200).send({article});
    }).catch(err => {
        next(err);
    })
}

function getArticles(req, res, next) {
    fetchArticles().then(articles => {
        res.status(200).send({articles});
    })
}

module.exports = {getArticleById, getArticles};