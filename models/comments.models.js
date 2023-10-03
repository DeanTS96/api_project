const db = require('../db/connection');

function fetchCommentsById(params) {
    const checkExists = db.query(`SELECT * FROM articles WHERE article_id = $1`, [params.article_id]);
    const query = db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,[params.article_id]);
    return Promise.all([query, checkExists]).then(([comments, article]) => {
        if(!article.rows.length) return Promise.reject({status: 404, msg: 'article doesn\'t exist'})
        else return comments.rows;
    });
}

function addCommentByArticleId(comment, params) {
    if(!comment.body.length) return Promise.reject({status: 400, msg: 'empty comment'});
    return db.query(`SELECT * FROM users WHERE username = $1`, [comment.username])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status: 404, msg: 'user doesn\'t exist'})
        return db.query(`SELECT * FROM articles WHERE article_id = $1`, [params.article_id])
    })
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status: 404, msg: 'article doesn\'t exist'});
        return db.query(`
        INSERT INTO comments (body, author, created_at, article_id, votes)
        VALUES ($1, $2, '${JSON.stringify(new Date(Date.now()))}', $3, 0) RETURNING *;
        `, [comment.body, comment.username, params.article_id]);
    }).then(({rows: comment}) => {
        return comment[0];
    });
}

module.exports = {fetchCommentsById, addCommentByArticleId};