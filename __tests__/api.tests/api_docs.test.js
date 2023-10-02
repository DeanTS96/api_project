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

describe('GET /api', () => {
    test('Bad sends back 200 and the read json api file', () => {
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