const db = require('../db/connection');

function fetchArticleById(params) {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [params.article_id]).then(({rows: article}) => {
        if(article.length === 0) return Promise.reject({status: 404, msg: 'article doesn\'t exist'});
        else return article[0];
    })
}

function fetchArticles(queries) {
    //return db.query(`SELECT * FROM topics WHERE slug = $1;`)
    const promiseAllArray = [];
    const values = [];
    let query = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id`;
    if(queries.topic) {
        values.push(queries.topic)
        query += ` WHERE a.topic = $${values.length}`;
        promiseAllArray.push(db.query(`SELECT * FROM topics WHERE slug = $1;`, [queries.topic]))
    }
    query += ` GROUP BY a.article_id ORDER BY a.created_at DESC;`;
    promiseAllArray.push(db.query(query, values));
    return Promise.all(promiseAllArray)
    .then((promiseAllResponse) => {
        if(promiseAllResponse.length === 2) {
            if(!promiseAllResponse[0].rows.length) return Promise.reject({status: 404, msg: 'topic doesn\'t exist'});
        }
        const articles = promiseAllResponse[promiseAllResponse.length-1].rows;
        return articles;
    })
}

module.exports = {fetchArticleById, fetchArticles};


