const {fetchCommentsById, addCommentByArticleId, removeCommentById, updateCommentById} = require('../models/comments.models')

function getCommentsById(req, res, next) {
    fetchCommentsById(req.params, req.query).then((comments) => {
        res.status(200).send({comments})
    }).catch(err => {
        next(err);
    })
}

function postCommentByArticleId(req, res, next) {
    addCommentByArticleId(req.body, req.params).then(comment => {
        res.status(201).send({comment})
    }).catch(err => {
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

function patchCommentById(req, res, next) {
    updateCommentById(req.params, req.body).then((comment) => {
        res.status(200).send({comment});
    }).catch(err => {
        next(err);
    })
}

module.exports = {getCommentsById, postCommentByArticleId, deleteCommentById, patchCommentById};