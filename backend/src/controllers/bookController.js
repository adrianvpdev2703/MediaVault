const { Book, Category } = require('../models');

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, { include: Category });
        if (!book)
            return res.status(404).json({ error: 'Libro no encontrado' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.findAll({ include: Category });
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createBook = async (req, res) => {
    try {
        const { title, link, categories } = req.body;
        if (!categories)
            return res
                .status(400)
                .json({ error: 'Se necesita almenos una categoria' });

        const book = await Book.create({
            title,
            link,
            cover: req.file ? req.file.filename : null,
        });

        const categoriesArray = categories
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0);

        const categoryInstances = [];
        for (const name of categoriesArray) {
            const [cat] = await Category.findOrCreate({ where: { name } });
            categoryInstances.push(cat);
        }

        await book.addCategories(categoryInstances);

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
};

exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book)
            return res.status(404).json({ error: 'Libro no encontrado' });

        const { title, link, categories } = req.body;
        if (title) book.title = title;
        if (link) book.link = link;
        if (req.file) book.cover = req.file.filename;

        await book.save();

        if (categories) {
            const categoriesArray = categories
                .split(',')
                .map((c) => c.trim())
                .filter((c) => c.length > 0);

            const categoryInstances = [];
            for (const name of categoriesArray) {
                const [cat] = await Category.findOrCreate({ where: { name } });
                categoryInstances.push(cat);
            }
            await book.setCategories(categoryInstances);
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book)
            return res.status(404).json({ error: 'Libro no encontrado' });

        await book.setCategories([]);
        await book.destroy();
        res.json({ message: 'Libro eliminado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
