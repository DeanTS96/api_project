const db = require('../db/connection');

function fetchTopics() {
    return db.query('SELECT * FROM topics;').then(({rows: topics}) => {
        return topics;
    })
}

function addTopic({slug, description}) {
    return db.query(`
    INSERT INTO topics (slug, description)
    VALUES ($1, $2)
    RETURNING *;
    `, [slug, description]).then(({rows: topic}) => {
        return topic[0];
    })
}

module.exports = {fetchTopics, addTopic};