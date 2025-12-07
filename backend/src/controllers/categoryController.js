const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            order: [['name', 'ASC']],
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
