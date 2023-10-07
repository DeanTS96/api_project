const request = require('supertest');
const app = require('../../app');
const db = require('../../db/connection');

afterAll(() => {
    db.end();
})

describe('GET /api/bad_api_endpoint', () => {
    test('404: /api/invalid_path sends back 404 and Bad api endpoint', () => {
        return request(app).get('/api/topicccccs').expect(404).then(({body}) => {
            expect(body.msg).toBe('Bad api endpoint');
        });
    })
})

describe('GET /api', () => {
    test('200: /api Sends back 200 and the json api file', () => {
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