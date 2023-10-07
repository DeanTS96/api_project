const db = require('../db/connection');
const articleExistsString = 'SELECT * FROM articles WHERE article_id = $1';

function fetchCommentsById(params, queries) {
    const checkArticleExists = db.query(articleExistsString, [params.article_id]);
    const limit = queries.limit || '10';
    const page = queries.p || '1';
    const query = db.query(`
    SELECT * FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET ${limit * (page - 1)};`,[params.article_id, limit]);
    return Promise.all([query, checkArticleExists]).then(([comments, article]) => {
        if(!article.rows.length) return Promise.reject({status: 404, msg: 'article doesn\'t exist'})
        else return comments.rows;
    });
}

function addCommentByArticleId(comment, params) {
    if(!comment.body.length) return Promise.reject({status: 400, msg: 'empty comment'});
    return db.query(articleExistsString, [params.article_id])
    .then(({rows}) => {
        if(!rows.length) return Promise.reject({status: 404, msg: 'article doesn\'t exist'});
        return db.query(`
        INSERT INTO comments (body, author, article_id)
        VALUES ($1, $2, $3) RETURNING *;
        `, [comment.body, comment.username, params.article_id]);
    }).then(({rows: comment}) => {
        return comment[0];
    });
}

function removeCommentById({comment_id}) {
    return db.query(`
    DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
}

function updateCommentById({comment_id}, {inc_votes = 0}) {
    if(isNaN(inc_votes)) return Promise.reject({status: 400, msg: 'inc_votes must be a number'});
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`, [inc_votes, comment_id]).then(({rows: comment}) => {
        if(!comment.length) return Promise.reject({status: 404, msg: 'comment doesn\'t exist'});
        return comment[0];
    })
}

module.exports = {fetchCommentsById, addCommentByArticleId, removeCommentById, updateCommentById};