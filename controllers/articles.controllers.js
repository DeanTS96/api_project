const {fetchArticleById} = require('../models/articles.models')

function getArticleById(req, res, next) {
    fetchArticleById(req.params).then((article) => {
        res.status(200).send({article});
    }).catch(err => {
        next(err);
    })
}

module.exports = {getArticleById};