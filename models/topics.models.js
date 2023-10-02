const db = require('../db/connection');

function fetchTopics() {
    return db.query('SELECT * FROM topics;').then(({rows: topics}) => {
        return topics;
    })
}

module.exports = {fetchTopics};