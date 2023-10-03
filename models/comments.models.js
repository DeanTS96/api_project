const db = require('../db/connection');

function fetchCommentsById(params) {
    console.log(params.article_id);
    const checkExists = db.query(`SELECT * FROM articles WHERE article_id = $1`, [params.article_id]);
    const query = db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,[params.article_id]);
    return Promise.all([query, checkExists]).then(([comments, article]) => {
        if(!article.rows.length) return Promise.reject({status: 404, msg: 'article doesn\'t exist'})
        else return comments.rows;
    });
}

module.exports = {fetchCommentsById};