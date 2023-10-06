const {fetchUsers, fetchUserByUsername} = require('../models/users.models');

function getUsers(req, res, next) {
    fetchUsers().then(users => {
        res.status(200).send({users});
    }).catch(err => {
        next(err);
    })
}

function getUserByUsername(req, res, next) {
    fetchUserByUsername(req.params).then(user => {
        res.status(200).send({user});
    }).catch(err => {
        next(err);
    })
}

module.exports = {getUsers, getUserByUsername};