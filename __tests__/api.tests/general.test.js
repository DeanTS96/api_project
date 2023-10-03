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

describe('GET topicccccs', () => {
    test('Bad sends back 404 and Bad api endpoint', () => {
        return request(app).get('/api/topicccccs').expect(404).then(({body}) => {
            expect(body.msg).toBe('Bad api endpoint');
        });
    })
})

describe('topics', () => {
    test('GET /api/topics returns with status code 200 and all the topics', () => {
        return request(app).get('/api/topics').expect(200).then(({body: topics}) => {
            topics.forEach(topic => {
                expect(topic).toEqual(expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                }))
            })
        });
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('200: GET /api/articles/:article_id/comments responds status 200 with an array of comment objects for a specific article, ordered last comment first', () => {
        return request(app).get('/api/articles/3/comments').expect(200).then(({body: comments}) => {
            expect(comments.comments).toHaveLength(2);
            expect(comments.comments).toBeSortedBy('created_at', {descending: true});
            comments.comments.forEach(comment => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                }))
            })
        });
    })
    test('200: GET /api/articles/:article_id/comments responds with status code 200 and returns an empty array when there are no comments for that article', () => {
        return request(app).get('/api/articles/2/comments').expect(200).then(({body: comments}) => {
            expect(comments.comments).toHaveLength(0);
        });
    })
    test('404: GET /api/articles/99999/comments responds with status 404 article doesn\'t exists', () => {
        return request(app).get('/api/articles/99999/comments').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: GET /api/articles/invalid_article_id/comments responds with 400 invalid id', () => {
        return request(app).get('/api/articles/invalid_id/comments').expect(400).then(({body: errResponse})=> {
            expect(errResponse.msg).toBe('invalid id')
        })
    })
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
    test('400: GET/api/articles/invalid_article_id responds with 400 an invalid id', () => {
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

describe('GET /api', () => {
    test('Sends back 200 and the read json api file', () => {
        return request(app).get('/api').expect(200).then(({body}) => {
            for(const api in body['API']) {
                expect(body['API'][api]).toEqual(expect.objectContaining({
                    description: expect.any(String),
                    queries: expect.any(Array),
                    exampleResponse: expect.any(Object)
                }))
            }
        });
    })
})