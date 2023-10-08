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

describe('GET /api/articles', () => {
    test('200: /api/articles responds with 200 and an arrray of all article objects, sorted by created_at by default and limited to 10 results', () => {
        return request(app).get('/api/articles').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(10);
            expect(articles.articles).toBeSortedBy('created_at',{descending: true})
            expect(articles.totalArticles).toBe("13");
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
    test('200: /api/articles?limit=10&p=2 responds with 200 and an arrray of all article objects, starting form the 6th article and only showing the next 5', () => {
        return request(app).get('/api/articles?limit=10&p=1').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(10);
            expect(articles.articles).toBeSortedBy('created_at',{descending: true});
            expect(articles.totalArticles).toBe("13");
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
    test('200: /api/articles?topic=topic_query responds with 200 and an array of articles only associated with the specific topic', () => {
        return request(app).get('/api/articles?topic=cats').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(1);
            expect(articles.totalArticles).toBe("1");
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
    test('200: /api/articles?topic=valid_topic_but_unassigned_to_any_articles responds with 200 and an empty array', () => {
        return request(app).get('/api/articles?topic=paper').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(0);
        })
    })
    test('200: /api/articles?sort_by=votes&&order=asc responds with 200 and an arrray of all article objects, sorted by votes and ordered by the least votes first', () => {
        return request(app).get('/api/articles?sort_by=votes&&order=asc').expect(200).then(({body: articles}) => {
            expect(articles.articles).toBeSortedBy('votes');
        })
    })
    test('400: /api/articles?limit=10&p=invalid_page responds with 400 invalid data', () => {
        return request(app).get('/api/articles?limit=10&p=invalid_page').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid data');
        })
    })
    test('400: /api/articles?limit=invalid_limit&p=2 responds with 400 invalid data', () => {
        return request(app).get('/api/articles?limit=10&p=invalid_page').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid data');
        })
    })
    test('404: /api/articles?topic=topic_doesn\'t_exist responds with 404 topic doesn\'t exist', () => {
        return request(app).get('/api/articles?topic=no_topic').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('topic doesn\'t exist');
        })
    })
    test('400: /api/articles?sort_by=votes&&order=invalid_sort_by responds with 400 invalid data', () => {
        return request(app).get('/api/articles?sort_by=invalid_sort_by&&order=asc').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid data');
        })
    })
})


describe('GET /api/articles/:article_id', () => {
    test('200: /api/articles/3 responds with 200 and the article matching that id', () => {
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
    test('404: /api/articles/99999 responds with 404 article doesn\'t exist', () => {
        return request(app).get('/api/articles/99999').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: /api/articles/invalid_article_id responds with 400 an invalid id', () => {
        return request(app).get('/api/articles/invalid_id').expect(400).then(({body: errResponse})=> {
            expect(errResponse.msg).toBe('invalid id')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('200: /api/articles/3 responds with status 200 and the updated article', () => {
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
    test('200: /api/articles/3 responds with 200 and the unchanged article when no inc_votes is specified', () => {
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
    test('404: /api/articles/99999 responds with 404 article doesn\'t exist', () => {
        return request(app).patch('/api/articles/99999').send({inc_votes: 1}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: /api/articles/invalid_article_id responds with 400 invalid id', () => {
        return request(app).patch('/api/articles/invalid_id').send({inc_votes: 1}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
    test('400: /api/articles/3 with bad inc_votes value responds with 400 inc_votes must be a number', () => {
        return request(app).patch('/api/articles/invalid_id').send({inc_votes: 'invalid_value'}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('inc_votes must be a number');
        })
    })
})

describe('POST /api/articles', () => {
    test('201: /api/articles responds with tatus 201 and the created article', () => {
        const articleToSend = {author: 'rogersop', title: 'rogersops title', body: 'rogersops body', topic: 'cats', article_img_url: 'https://images.fake_image.png'};
        return request(app).post('/api/articles').send(articleToSend).expect(201).then(({body: article}) => {
            expect(article.article).toEqual(expect.objectContaining({
                article_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number),
                author: 'rogersop', 
                title: 'rogersops title', 
                body: 'rogersops body', 
                topic: 'cats', 
                article_img_url: 'https://images.fake_image.png',
                comment_count: 0
            }))
        });
    })
    test('400: /api/articles responds with 400 invalid data when NOT NULL data is missing', () => {
        const articleToSend = {author: 'rogersop', body: 'rogersops body', topic: 'cats', article_img_url: 'https://images.fake_image.png'};
        return request(app).post('/api/articles').send(articleToSend).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid data');
        })
    })
    test('404: /api/articles responds with 404 user doesn\'t exist when author doesn\'t exist', () => {
        const articleToSend = {author: 'user_doesn\'t_exist', title: 'rogersops title', body: 'rogersops body', topic: 'cats', article_img_url: 'https://images.fake_image.png'};
        return request(app).post('/api/articles').send(articleToSend).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('user doesn\'t exist');
        })
    })
    test('404: /api/articles responds with 404 topic doesn\'t exist when topic doesn\'t exist', () => {
        const articleToSend = {author: 'rogersop', title: 'rogersops title', body: 'rogersops body', topic: 'topic_doesn\'t exist', article_img_url: 'https://images.fake_image.png'};
        return request(app).post('/api/articles').send(articleToSend).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('topic doesn\'t exist');
        })
    })
})

describe('DELETE /api/articles/:article_id', () => {
    test('204: /api/articles/1 responds with status 204 and no content, showing the article was deleted', () => {
        return request(app).delete('/api/articles/1').expect(204).then(() => {
            return db.query(`
            SELECT * FROM comments WHERE article_id = 1`)
        }).then(({rows: comments}) => {
            expect(comments).toHaveLength(0);
        })
    })
    test('204: /api/articles/no_article_on_id responds with status code 204 and does nothing since article already doesn\'t exist', () => {
        return request(app).delete('/api/articles/99999').expect(204);
    })
    test('400: /api/articles/invalid_id responds with status code 400 invalid id', () => {
        return request(app).delete('/api/articles/invalid_id').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
})