const db = require('../db/connection');

function fetchArticleById(params) {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [params.article_id]).then(({rows: article}) => {
        if(article.length === 0) return Promise.reject({status: 404, msg: 'article doesn\'t exist'});
        else return article[0];
    })
}

function fetchArticles() {
    return db.query(`
    SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id GROUP BY a.article_id ORDER BY a.created_at DESC;`).then(({rows: articles}) => {
        return articles;
    })
}

module.exports = {fetchArticleById, fetchArticles};


