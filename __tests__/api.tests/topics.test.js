const request = require('supertest');
const app = require('../../app');
const db = require('../../db/connection');

afterAll(() => {
    db.end();
})

describe('GET /api/topics', () => {
    test('200: /api/topics returns with status code 200 and all the topics', () => {
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