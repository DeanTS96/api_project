const {fetchCommentsById, addCommentByArticleId, removeCommentById} = require('../models/comments.models')

function getCommentsById(req, res, next) {
    fetchCommentsById(req.params).then((comments) => {
        res.status(200).send({comments})
    }).catch(err => {
        next(err);
    })
}

function postCommentByArticleId(req, res, next) {
    addCommentByArticleId(req.body, req.params).then(comment => {
        res.status(201).send({comment})
    }).catch(err => {
        console.log(err);
        next(err);
    })
}

function deleteCommentById(req, res, next) {
    removeCommentById(req.params).then(() => {
        res.sendStatus(204);
    }).catch(err => {
        next(err);
    })
}

module.exports = {getCommentsById, postCommentByArticleId, deleteCommentById};