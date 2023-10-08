const request = require('supertest');
const app = require('../../app');
const db = require('../../db/connection');
const seed = require('../../db/seeds/seed');
const data = require('../../db/data/test-data/');

beforeEach(() => {
    return seed(data);
})

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

describe('POST /api/topics', () => {
    test('201: /api/topics returns status code 201 and the newly created topic', () => {
        return request(app).post('/api/topics').send({slug: 'test_slug', description: 'test_description'}).expect(201).then(({body: topic})=> {
            expect(topic.topic).toEqual(expect.objectContaining({
                slug: 'test_slug',
                description: 'test_description'
            }))
        })
    })
    test('400: /api/topics returns 400 invalid data when not passed a slug', () => {
        return request(app).post('/api/topics').send({description: 'test_description'}).expect(400).then(({body: errResponse}) => {
            expect(errResponse.msg).toBe('invalid data');
        })
    })
})