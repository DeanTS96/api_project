const db = require('../db/connection');

function fetchUsers() {
    return db.query(`
    SELECT * FROM users;`).then(({rows: users}) => {
        return users;
    })
}

module.exports = {fetchUsers};