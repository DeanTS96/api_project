const request = require('supertest');
const app = require('../../app');
const db = require('../../db/connection');

afterAll(() => {
    db.end();
})

describe('/api/users', () => {
    test('200: GET responds with 200 and all users', () => {
        return request(app).get('/api/users').expect(200).then(({body: users}) => {
            expect(users.users).toHaveLength(4)
            users.users.forEach(user => {
                expect(user).toEqual(expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                }))
            })
        })
    })
})
