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

describe('/api/articles', () => {
    test('200: GET/api/articles responds with 200 and an arrray of all article objects, sorted by created_at by default', () => {
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
    test('200: GET/api/articles?topic=topic_query responds with 200 and an array of articles only associated with the specific topic', () => {
        return request(app).get('/api/articles?topic=cats').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(1);
            articles.articles.forEach(article => {
                expect(article).toEqual(expect.objectContaining({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'cats',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(String)
                }))
            })
        });
    })
    test('200: GET/api/articles?topic=valid_topic_but_unassigned_to_any_articles responds with 200 and an empty array', () => {
        return request(app).get('/api/articles?topic=paper').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(0);
        })
    })
    test('404: GET/api/articles?topic=topic_doesn\'t_exist responds with 404 topic doesn\'t exist', () => {
        return request(app).get('/api/articles?topic=no_topic').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('topic doesn\'t exist');
        })
    })
    test('200: GET/api/articles?sort_by=votes&&order=asc responds with 200 and an arrray of all article objects, sorted by votes and ordered by the least votes first', () => {
        return request(app).get('/api/articles?sort_by=votes&&order=asc').expect(200).then(({body: articles}) => {
            expect(articles.articles).toBeSortedBy('votes');
        })
    })
    test('400: GET/api/articles?sort_by=votes&&order=invalid_sort_by responds with 400 invalid query', () => {
        return request(app).get('/api/articles?sort_by=invalid_sort_by&&order=asc').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid query');
        })
    })
})


describe('/api/articles/:article_id', () => {
    test('200: GET/api/articles/3 responds with 200 and the article matching that id', () => {
        return request(app).get('/api/articles/3').expect(200).then(({body: articleResponse}) => {
            const article = articleResponse.article;
            expect(article).toEqual(expect.objectContaining({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: '2020-11-03T09:12:00.000Z',
                votes: 0,
                article_img_url:'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: '2',
            }));
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
    test('200: PATCH/api/articles/3 responds with status 200 and the updated article', () => {
        return request(app).patch('/api/articles/3').send({inc_votes: 1}).expect(200).then(({body: article}) => {
            expect(article.article).toEqual(expect.objectContaining({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: expect.any(String),
                votes: 1,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }))
        });
    })
    test('200: PATCH/api/articles/3 responds with 200 and the unchanged article when no inc_votes is specified', () => {
        return request(app).patch('/api/articles/3').send({}).expect(200).then(({body: article}) => {
            expect(article.article).toEqual(expect.objectContaining({
                article_id: 3,
                title: 'Eight pug gifs that remind me of mitch',
                topic: 'mitch',
                author: 'icellusedkars',
                body: 'some gifs',
                created_at: expect.any(String),
                votes: 0,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }))
        });
    })
    test('404: PATCH/api/articles/99999 responds with 404 article doesn\'t exist', () => {
        return request(app).patch('/api/articles/99999').send({inc_votes: 1}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: PATCH/api/articles/invalid_article_id responds with 400 invalid id', () => {
        return request(app).patch('/api/articles/invalid_id').send({inc_votes: 1}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
    test('400: PATCH/api/articles/3 with bad inc_votes value responds with 400 inc_votes must be a number', () => {
        return request(app).patch('/api/articles/invalid_id').send({inc_votes: 'hello'}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('inc_votes must be a number');
        })
    })
})