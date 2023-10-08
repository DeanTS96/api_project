const {fetchTopics, addTopic} = require('../models/topics.models')

function getTopics(req, res, next) {
    fetchTopics().then(topics => {
        res.status(200).send(topics);
    })
}

function postTopic(req, res, next) {
    addTopic(req.body).then(topic => {
        res.status(201).send({topic});
    }).catch(err => {
        next(err);
    })
}
module.exports = {getTopics, postTopic};