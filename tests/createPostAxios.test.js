import { describe, expect, test } from '@jest/globals';
import api from '../axiosConfig.js';

describe('API test for jsonplaceholder', () => {

    test.skip('Should check users list', async () => {
        const response = await api.get('/posts');
        expect(response.status).toBe(200);
        expect(response.data[0]).toHaveProperty('id');
        expect(response.data[0]).toHaveProperty('userId');
        expect(response.data[0]).toHaveProperty('title');
        expect(response.data[0]).toHaveProperty('body');
        expect(response.data.length).toBeGreaterThan(0);
    });

    test.skip('Should check user #4 by ID', async () => {
        const response = await api.get('/posts/4')
        expect(response.status).toBe(200);
        const user = response.data;
        expect(user).toMatchObject({
        id: 4,
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String)
       });
    });

    test.skip('Should check user #5 by ID and title', async () => {
        const response = await api.get('/posts/5')
        expect(response.status).toBe(200);
        const user = response.data;
        const title = user.title 
        expect(title).toBe('nesciunt quas odio');
        expect(user).toMatchObject({
        id: 5,
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String)
        });
    })

    test.skip('Should check user #6 by ID and body', async () => {
        const response = await api.get('/posts/6')
        expect(response.status).toBe(200);
        const user = response.data;
        const body = user.body 
        expect(body).toContain('ut aspernatur corporis harum nihil quis provident sequi');
        expect(user).toMatchObject({
        id: 6,
        userId: expect.any(Number),
        title: expect.any(String),
        body: expect.any(String)
        });
    });

    test.skip('Should create a new user with own data', async () => {
        const requestBody = {
            title: 'Onece upon a time',
            body: 'The task is done',
            userId: 100,
        }
        const response = await api.post('/posts', requestBody );
        expect(response.status).toBe(201);
        const post = response.data;

        expect(post).toEqual({
            id: expect.any(Number),
            ...requestBody
        })
    })
})
