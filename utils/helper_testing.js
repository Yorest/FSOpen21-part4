const bcrypt = require('bcryptjs');

const Blog = require('../models/blogs');
const User = require('../models/user');

const usersInDb = async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();

    const users = await User.find({});
    return users.map((u) => u.toJSON());
};

const initialBlogs = async () => {
    const users = await usersInDb();

    const i = Math.floor(Math.random() * (users.length-1))

    const user = users[i].id;

    return [
        {
            title: 'Javascript',
            author: 'Missael Rodriguez',
            url: 'https://node.com',
            likes: 5,
            id: '60b1de5a2e59b446e8751b74',
            user,
        },
        {
            title: 'Javascript React',
            author: 'Jordan Lopez',
            url: 'https://nodejs.com',
            likes: 2,
            id: '60b1e7778db3d750cc679649',
            user,
        },
    ];
};

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Javascript React 2',
        author: 'Jordan Lopez',
        url: 'https://nodejs.com',
        likes: 5,
    });
    await blog.save();
    await blog.remove();

    return blog._id.toString();
};

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map((blog) => blog.toJSON());
};

module.exports = {
    initialBlogs,
    nonExistingId,
    blogsInDb,
    usersInDb,
};
