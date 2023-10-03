const db = require('../db/connection');

function fetchCommentsById(params) {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,[params.article_id]).then(({rows}) => {
        return rows;
    });
}

module.exports = {fetchCommentsById};