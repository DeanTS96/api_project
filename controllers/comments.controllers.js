const {fetchCommentsById} = require('../models/comments.models')

function getCommentsById(req, res, next) {
    fetchCommentsById(req.params).then((comments) => {
        console.log(comments);
        res.status(200).send({comments})
    }).catch(err => {
        next(err);
    })
}

module.exports = {getCommentsById};