const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('../utils/helper_testing');
const Blog = require('../models/blogs');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});

    const blogs = await helper.initialBlogs();

    const blogObjects = blogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
});

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs/');

    expect(response.body).toHaveLength(2);
});

test('verify id', async () => {
    const response = await api.get('/api/blogs/');

    expect(response.body[0].id).toBeDefined();
});

test('verify create new blog', async () => {
    const newBlog = {
        title: 'holasssssss',
        author: 'Yorvinssssssss',
        url: 'nose.com',
        likes: 5,
        userId: '60bb7cab4e89a7582c2d78e6',
    };

    await api
        .post('/api/blogs')
        .set({
            Authorization:
                'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IllvcmVzdCIsImlkIjoiNjBiYjc0MTAzMjUzYmIxZTY4NzEzZDNiIiwiaWF0IjoxNjIyODk4OTgwfQ.sS1En2g9rl-NBGUY69F1m2JSK6Xe1sfgTopyU7Fb0uo',
        })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const contents = blogsAtEnd.map((n) => n.title);
    expect(contents).toContain('holasssssss');
});

test('verify create new blog with likes 0', async () => {
    const newBlog = {
        title: 'holasssssss',
        author: 'Yorvinssssssss',
        url: 'nose.com',
    };

    let result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    result = JSON.parse(result.text);

    expect(result.likes).toBe(0);
});

test('verify create new blog without title and url', async () => {
    const newBlog = {
        author: 'Yorvinssssssss',
        likes: 5,
    };

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/);
});

afterAll(() => {
    mongoose.connection.close();
});
