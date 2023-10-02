const db = require('../db/connection');

function fetchArticleById(params) {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [params.article_id]).then(({rows: article}) => {
        if(article.length === 0) return Promise.reject({status: 404, msg: 'article doesn\'t exist'});
        else return article[0];
    })
}

module.exports = {fetchArticleById};