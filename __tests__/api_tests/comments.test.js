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

describe('GET /api/articles/:article_id/comments', () => {
    test('200: /api/articles/:article_id/comments responds status 200 with an array of comment objects for a specific article, ordered last comment first limit to 10 by default', () => {
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
    test('200: /api/articles/:article_id/comments?limit=10&p=2 responds status 200 with an array of comment objects ordered last comment first, limited to 10 and showing the scond page', () => {
        return request(app).get('/api/articles/1/comments?limit=10&p=2').expect(200).then(({body: comments}) => {
            expect(comments.comments).toHaveLength(1);
            expect(comments.comments).toBeSortedBy('created_at', {descending: true});
            comments.comments.forEach(comment => {
                expect(comment).toEqual(expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    article_id: 1,
                    author: expect.any(String),
                    votes: expect.any(Number),
                    created_at: expect.any(String)
                }))
            })
        });
    })
    test('200: /api/articles/:article_id/comments responds with status code 200 and returns an empty array when there are no comments for that article', () => {
        return request(app).get('/api/articles/2/comments').expect(200).then(({body: comments}) => {
            expect(comments.comments).toHaveLength(0);
        });
    })
    test('404: /api/articles/99999/comments responds with status 404 article doesn\'t exists', () => {
        return request(app).get('/api/articles/99999/comments').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: /api/articles/invalid_article_id/comments responds with 400 invalid id', () => {
        return request(app).get('/api/articles/invalid_id/comments').expect(400).then(({body: errResponse})=> {
            expect(errResponse.msg).toBe('invalid id')
        })
    })
    test('400: /api/articles/1/comments?limit=10&p=invalid_page responds with 400 invalid data', () => {
        return request(app).get('/api/articles/1/comments?limit=10&p=invalid_page').expect(400).then(({body: errResponse})=> {
            expect(errResponse.msg).toBe('invalid data')
        })
    })
    test('400: /api/articles/1/comments?limit=invalid_limit&p=1 responds with 400 invalid data', () => {
        return request(app).get('/api/articles/1/comments?limit=invalid_limit&p=1').expect(400).then(({body: errResponse})=> {
            expect(errResponse.msg).toBe('invalid data')
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('201: /api/articles/3/comments responds with status 201 and adds a comment to an article, sending back the posted comment', () => {
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
    test('404: /api/articles/99999/comments responds with status 404 article doesn\'t exist when sent an invalid id', () => {
        return request(app).post('/api/articles/99999/comments').send({username: 'rogersop', body: 'nice'}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('article doesn\'t exist');
        })
    })
    test('400: /api/articles/invalid_id/comments responds with status 400 invalid id when sent a bad id', () => {
        return request(app).post('/api/articles/invalid_id/comments').send({username: 'rogersop', body: 'nice'}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
    test('404: /api/articles/3/comments responds with 404 user doesn\'t exist when sent with  user that doesn\'t exist in the database', () => {
        return request(app).post('/api/articles/3/comments').send({username: 'dean', body: 'nice'}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('user doesn\'t exist');
        })
    })
    test('400: /api/articles/3/comments responds with 400 empty comment when sent with no comment', () => {
        return request(app).post('/api/articles/3/comments').send({username: 'dean', body: ''}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('empty comment');
        })
    })
})

describe('DELETE /api/comments/comment_id', () => {
    test('204: /api/comments/2 responds with status code 204 and deletes the comment', () => {
        return request(app).delete('/api/comments/2').expect(204).then(() => {
            return db.query(`
            SELECT * FROM comments WHERE comment_id = 2`)
        }).then(({rows: comment}) => {
            expect(comment).toHaveLength(0);
        })
    })
    test('204: /api/comments/no_comment_for_id responds with status code 204 and does nothing since comment already doesn\'t exist', () => {
        return request(app).delete('/api/comments/99999').expect(204)
    })
    test('400: /api/comments/invalid_id responds with status code 400 invalid id', () => {
        return request(app).delete('/api/comments/invalid_id').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
})

describe('PATCH /api/comments/comment_id', () => {
    test('200: /api/comments/1 responds with status 200 and the updated comment incremented by the positive value', () => {
        return request(app).patch('/api/comments/1').send({inc_votes: 2}).expect(200).then(({body: comment}) => {
            expect(comment.comment).toEqual(expect.objectContaining({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 9,
                author: 'butter_bridge',
                votes: 18,
                created_at: '2020-04-06T12:17:00.000Z'
            }))
        })
    })
    test('200: /api/comments/1 responds with status 200 and the updated comment decramented by the negative value', () => {
        return request(app).patch('/api/comments/1').send({inc_votes: -3}).expect(200).then(({body: comment}) => {
            expect(comment.comment).toEqual(expect.objectContaining({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 9,
                author: 'butter_bridge',
                votes: 13,
                created_at: '2020-04-06T12:17:00.000Z'
            }))
        })
    })
    test('200: /api/comments/1 responds with status 200 and unchanged comment when no value is passed', () => {
        return request(app).patch('/api/comments/1').send({}).expect(200).then(({body: comment}) => {
            expect(comment.comment).toEqual(expect.objectContaining({
                comment_id: 1,
                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                article_id: 9,
                author: 'butter_bridge',
                votes: 16,
                created_at: '2020-04-06T12:17:00.000Z'
            }))
        })
    })
    test('404: /api/comments/99999 responds with status 404 comment doesn\'t exist', () => {
        return request(app).patch('/api/comments/99999').send({inc_votes: -3}).expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('comment doesn\'t exist');
        })
    })
    test('400: /api/comments/invaalid_id responds with 400 invalid id', () => {
        return request(app).patch('/api/comments/invalid_id').send({inc_votes: -3}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
    test('400: /api/comments/1 send with an invalid inc_votes value responds with 400 inc_votes must be a number', () => {
        return request(app).patch('/api/comments/invalid_id').send({inc_votes: 'invalid_value'}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('inc_votes must be a number');
        })
    })
})
