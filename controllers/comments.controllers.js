const {fetchCommentsById} = require('../models/comments.models')

function getCommentsById(req, res, next) {
    fetchCommentsById(req.params).then((comments) => {
        res.status(200).send({comments})
    })
}

module.exports = {getCommentsById};