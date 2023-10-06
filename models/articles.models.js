const db = require('../db/connection');

function fetchArticleById(params) {
    return db.query(`
    SELECT a.article_id, a.title, a.topic, a.author, a.body, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
    FROM articles a LEFT JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id 
    HAVING a.article_id = $1`, [params.article_id])
    .then(({rows: article}) => {
        if(article.length === 0) return Promise.reject({status: 404, msg: 'article doesn\'t exist'})
        else return article[0];
    })
}

function fetchArticles(queries) {
    const promiseAllArray = [];
    const values = [];
    const sortByOrder = queries.order === 'asc' ? 'ASC': 'DESC';
    const validSortBys = {
        article_id: 'article_id',
        title: 'title',
        topic: 'topic',
        author: 'author',
        created_at: 'created_at',
        votes: 'votes',
        comment_count: 'comment_count',
    }
    const sortBy = queries.sort_by || 'created_at';
    let query = `
    SELECT a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url, COUNT(c.comment_id) AS comment_count 
    FROM articles a
    LEFT JOIN comments c ON a.article_id = c.article_id`;
    if(queries.topic) {
        values.push(queries.topic)
        query += ` WHERE a.topic = $${values.length}`;
        promiseAllArray.push(db.query(`SELECT * FROM topics WHERE slug = $1;`, [queries.topic]))
    }
    query += ` GROUP BY a.article_id ORDER BY ${validSortBys[sortBy]} ${sortByOrder};`;
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

function updateArticleById({article_id}, {inc_votes = 0}) {
    if(isNaN(inc_votes)) return Promise.reject({status: 400, msg: 'inc_votes must be a number'});
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `, [inc_votes, article_id]).then(({rows: article}) => {
        if(article.length === 0) return Promise.reject({status: 404, msg: 'article doesn\'t exist'});
        return article[0];
    })
}

function addArticle(article) {
    return db.query(`
    SELECT * FROM topics WHERE slug = $1`, [article.topic]).then(({rows: topic}) => {
        if(!topic.length) return Promise.reject({status: 404, msg: 'topic doesn\'t exist'});
        return db.query(`
        INSERT INTO articles 
        (author, title, body, topic, article_img_url)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *;
        `, [article.author, article.title, article.body, article.topic, article.article_img_url])
    })
    .then(({rows: article}) => {
        article[0].comment_count = 0;
        return article[0];
    })
}

module.exports = {fetchArticleById, fetchArticles, updateArticleById, addArticle};


