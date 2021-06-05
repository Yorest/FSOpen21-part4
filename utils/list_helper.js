const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1;
};

const totalLikes = (blogs) => {
    const reducer = (sum, item) => sum + item.likes;

    return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
    let mostBlog = blogs[0] || [];

    blogs.forEach((blog) => {
        if (blog.likes > mostBlog.likes) {
            mostBlog = blog;
        }
    });

    return mostBlog;
};

const mostBlogs = (blogs) => {
    let blogsCount = [];

    _.forEach(_.groupBy(blogs, 'author'), function (value, key) {
        const count = _.countBy(value, 'blog');
        blogsCount = blogsCount.concat({ author: key, blogs: count.undefined });
    });

    return _.maxBy(blogsCount, 'blogs');
};

const mostLikes = (blogs) => {
    let likes = [];

    _.forEach(_.groupBy(blogs, 'author'), function (value, key) {
        const sum = _.sumBy(value, 'likes');
        likes = likes.concat({ author: key, likes: sum });
    });

    return _.maxBy(likes, 'likes');
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
