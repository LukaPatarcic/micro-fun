import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
    .post('/api/users/signup')
    .send({
        body: {
            email: 'email@gmail.com',
            password: 'password123'
        }
    })
    .expect(201);
})