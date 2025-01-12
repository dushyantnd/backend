const express = require('express');
const router = express.Router();
const NewsCategory = require('../models/NewsCategory');

// Create a new category
router.post('/', async (req, res) => {
    try {
        const category = new NewsCategory(req.body);
        await category.save();
        res.status(201).json({ success: true, data: category });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categories = await NewsCategory.find().populate('parent_id', 'name slug');
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await NewsCategory.findById(req.params.id).populate('parent_id', 'name slug');
        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Get a single category by slug
router.get('/slug/:slug', async (req, res) => {
    try {
        const category = await NewsCategory.findOne({ slug: req.params.slug });

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await NewsCategory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('parent_id', 'name slug');
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});



// Delete a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCategory = await NewsCategory.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
