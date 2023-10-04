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
                    article_id: 3,
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
    test('201: POST /api/articles/3/comments responds with status 201 and adds a comment to an article, sending back the posted comment', () => {
        return request(app).post('/api/articles/3/comments').send({username: 'rogersop', body: 'nice'}).expect(201).then(({body: comment}) => {
            expect(comment.comment).toEqual(expect.objectContaining({
                comment_id: 19,
                body: 'nice',
                article_id: 3,
                author: 'rogersop',
                votes: 0,
                created_at: expect.any(String)
            }))
        });
    })
    test('404: POST /api/articles/99999/comments responds with status 404 article doesn\'t exist when sent an invalid id', () => {
        return request(app).post('/api/articles/99999/comments').send({username: 'rogersop', body: 'nice'}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: POST /api/articles/invalid_id/comments responds with status 400 invalid id when sent a bad id', () => {
        return request(app).post('/api/articles/invalid_id/comments').send({username: 'rogersop', body: 'nice'}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
    test('404: POST /api/articles/3/comments responds with 404 user doesn\'t exist when sent with  user that doesn\'t exist in the database', () => {
        return request(app).post('/api/articles/3/comments').send({username: 'dean', body: 'nice'}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('user doesn\'t exist');
        })
    })
    test('400: POST /api/articles/3/comments responds with 400 empty comment when sent with no comment', () => {
        return request(app).post('/api/articles/3/comments').send({username: 'dean', body: ''}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('empty comment');
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
    test('200 GET/api/articles?topic=topic_query responds with 200 and an array of articles only associated with the specific topic', () => {
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
    test('200 GET/api/articles?topic=valid_topic_but_unassigned_to_any_articles responds with 200 and an empty array', () => {
        return request(app).get('/api/articles?topic=paper').expect(200).then(({body: articles}) => {
            expect(articles.articles).toHaveLength(0);
        })
    })
    test('404 GET/api/articles?topic=topic_doesn\'t_exist responds with 404 topic doesn\'t exist', () => {
        return request(app).get('/api/articles?topic=no_topic').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('topic doesn\'t exist');
        })
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

describe('checkArticleExists()', () => {
    test('returns an article from the database if it exists', () => {

    })
})