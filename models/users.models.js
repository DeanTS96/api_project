const db = require('../db/connection');

function fetchUsers() {
    return db.query(`
    SELECT * FROM users;`).then(({rows: users}) => {
        return users;
    })
}

function fetchUserByUsername({username}) {
    return db.query(`
    SELECT * FROM users WHERE username = $1;`, [username]).then(({rows: user}) => {
        if(!user.length) return Promise.reject({status: 404, msg: 'user doesn\'t exist'});
        return user[0];
    })
}

module.exports = {fetchUsers, fetchUserByUsername};