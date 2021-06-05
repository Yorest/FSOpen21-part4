const jwt = require('jsonwebtoken');

const blogsRouter = require('express').Router();

const Blog = require('../models/blogs');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { name: 1 });
    response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
    const note = await Blog.findById(request.params.id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

blogsRouter.post('/', async (request, response) => {
    const body = request.body;

    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' });
    }

    const user = await User.findById(decodedToken.id);

    // eslint-disable-next-line no-prototype-builtins
    if (!request.body.hasOwnProperty('likes')) {
        request.body.likes = 0;
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);

    await user.save();

    response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
    // eslint-disable-next-line no-undef
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const blog = await Blog.findById(request.params.id);

    if (!(blog.user.toString() === decodedToken.id)) {
        response.status(403).send({ error: 'user dont have permission' });
    }

    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    };

    const updatedNote = await Blog.findByIdAndUpdate(request.params.id, blog, {
        new: true,
    });

    response.json(updatedNote);
});

module.exports = blogsRouter;
