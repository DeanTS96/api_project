const request = require('supertest');
const app = require('../../app');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data/');
const db = require('../../db/connection');

beforeEach(() => {
    return seed(data);
})

afterAll(() => {
    db.end();
})

describe('/api/articles/:article_id', () => {
    test('200: GET/api/articles/3 responds with 200 and the article matching that id', () => {
        return request(app).get('/api/articles/3').expect(200).then(({body: articleResponse}) => {
            const article = articleResponse.article;
            expect(article.article_id).toBe(3);
            expect(article.title).toBe('Eight pug gifs that remind me of mitch');
            expect(article.topic).toBe('mitch');
            expect(article.author).toBe('icellusedkars');
            expect(article.body).toBe('some gifs');
            expect(article.created_at).toBe('2020-11-03T09:12:00.000Z');
            expect(article.votes).toBe(0);
            expect(article.article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
        });
    })
    test('404: GET/api/articles/99999 responds with 404 article doesn\'t exist', () => {
        return request(app).get('/api/articles/99999').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: GET/api/articles/invalid-article_id responds with 400 an invalid id', () => {
        return request(app).get('/api/articles/invalid_id').expect(400).then(({body: errResponse})=> {
            expect(errResponse.msg).toBe('invalid id')
        })
    })
})

describe('/api/articles', () => {
    test('200 GET/api/articles responds with 200 and an arrray of all article objects', () => {
        return request(app).get('/api/articles').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(13);
            expect(articles.articles).toBeSortedBy('created_at',{descending: true})
            articles.articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                }))
            })
        });
    })
})