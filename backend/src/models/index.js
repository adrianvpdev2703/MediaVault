const sequelize = require('../config/db');
const Book = require('./Book');
const Video = require('./Video');
const Category = require('./Category');

Book.belongsToMany(Category, { through: 'BookCategories' });
Category.belongsToMany(Book, { through: 'BookCategories' });

Video.belongsToMany(Category, { through: 'VideoCategories' });
Category.belongsToMany(Video, { through: 'VideoCategories' });

module.exports = {
    sequelize,
    Book,
    Video,
    Category,
};
