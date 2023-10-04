const {fetchArticleById, fetchArticles, updateArticleById} = require('../models/articles.models')

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

function patchArticleById(req, res, next) {
    console.log(req.params);
    console.log(req.body);
    updateArticleById(req.params).then(article => {
        res.status(200).send(article);
    })
}

module.exports = {getArticleById, getArticles, patchArticleById};