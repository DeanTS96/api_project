const request = require('supertest');
const app = require('../../app');
const db = require('../../db/connection');

afterAll(() => {
    db.end();
})

describe('GET /api/users', () => {
    test('200: responds with 200 and all users', () => {
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

describe('GET /api/users/:username', () => {
    test('200: /api/users/rogersop responds with status 200 and rogersop user object', () => {
        return request(app).get('/api/users/rogersop').expect(200).then(({body: user}) => {
            console.log(user)
            expect(user.user).toEqual(expect.objectContaining({
                username: 'rogersop',
                name: 'paul',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            }))
        })
    })
    test('404: /api/users/user_doesn\'t_exist respondds with 404 user doesn\'t exist', () => {
        return request(app).get('/api/users/user_doesn\'t_exist').expect(404).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('user doesn\'t exist');
        })
    })
})
