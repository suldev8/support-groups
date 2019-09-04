const express = require('express');
const router = express.Router();

const Category = require('../models/category');

router.get('/categories', (req, res, next) => {
    Category.find({})
    .then(categories => res.status(200).json(
        {
            categories: categories.map(category => (
                    {
                        id: category.id,
                        name: category.name
                    }
                ))
        }))
    .catch(next);
});


module.exports = router;

