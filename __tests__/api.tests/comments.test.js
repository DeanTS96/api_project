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

describe('/api/comments/comment_id', () => {
    test('204: DELETE/api/comments/2 responds with status code 204 and deletes the comment', () => {
        return request(app).delete('/api/comments/2').expect(204).then(() => {
            return db.query(`
            SELECT * FROM comments WHERE comment_id = 2`)
        }).then(({rows: comment}) => {
            expect(comment).toHaveLength(0);
        })
    })
    test('204: DELETE/api/comments/no_comment_for_id responds with status code 204 and does nothing since comment already doesn\'t exist', () => {
        return request(app).delete('/api/comments/99999').expect(204)
    })
    test('400: DELETE/api/comments/invalid_id responds with status code 400 invalid id', () => {
        return request(app).delete('/api/comments/invalid_id').expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid id');
        })
    })
})
