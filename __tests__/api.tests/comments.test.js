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
    test('GET /api/articles/:article_id/comments', () => {
        return request(app).get('/api/articles/3/comments').expect(200).then(({body: comments}) => {
            expect(comments.comments).toHaveLength(2);
            expect(comments.comments).toBeSortedBy('created_at', {descending: true});
            console.log(comments);
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
})