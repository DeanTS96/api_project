const {fetchArticleById, fetchArticles, updateArticleById, addArticle, removeArticleById} = require('../models/articles.models')

function getArticleById(req, res, next) {
    fetchArticleById(req.params).then((article) => {
        res.status(200).send({article});
    }).catch(err => {
        next(err);
    })
}

function getArticles(req, res, next) {
    fetchArticles(req.query).then(articles => {
        res.status(200).send(articles);
    }).catch(err => {
        next(err);
    })
}

function patchArticleById(req, res, next) {
    updateArticleById(req.params, req.body).then(article => {
        res.status(200).send({article});
    }).catch(err => {
        next(err);
    })
}

function postArticle(req, res, next) {
    addArticle(req.body).then(article => {
        res.status(201).send({article});
    }).catch(err => {
        next(err);
    })
}

function deleteArticleById(req, res, next) {
    removeArticleById(req.params).then(() => {
        res.status(204).send();
    }).catch(err => {
        next(err);
    })
}

module.exports = {getArticleById, getArticles, patchArticleById, postArticle, deleteArticleById};