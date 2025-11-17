import { expect, test } from '@jest/globals';
import axios from 'axios';

test.skip('sample test', async () => {
    const todoId = 1;
    const response = await axios(`https://jsonplaceholder.typicode.com/todos/${todoId}`);

    expect(response.data).toMatchObject({ 
        userId: todoId,
        id: expect.any(Number),
        title: expect.any(String),
     });
});
