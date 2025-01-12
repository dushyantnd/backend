const express = require('express');
const router = express.Router();
const NewsVidhan = require('../models/NewsVidhan');
const NewsVidhanSabha = require('../models/NewsVidhanSabha');

// Create a new category
router.post('/', async (req, res) => {
    try {
        const vidhan = new NewsVidhan(req.body);
        await vidhan.save();
        res.status(201).json({ success: true, data: vidhan });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const vidhans = await NewsVidhan.find();
        res.status(200).json({ success: true, data: vidhans });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get a single category by ID
router.get('/:id', async (req, res) => {
    try {
        const vidhan = await NewsVidhan.findById(req.params.id);
        if (!vidhan) {
            return res.status(404).json({ success: false, message: 'Vidhan not found' });
        }
        res.status(200).json({ success: true, data: vidhan });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Get a single category by slug
router.get('/slug/:slug', async (req, res) => {
    try {
        const vidhan = await NewsVidhan.findOne({ slug: req.params.slug });

        if (!vidhan) {
            return res.status(404).json({ success: false, message: 'Vidhan not found' });
        }
        res.status(200).json({ success: true, data: vidhan });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedVidhan = await NewsVidhan.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate('parent_id', 'name slug');
        if (!updatedVidhan) {
            return res.status(404).json({ success: false, message: 'Vidhan not found' });
        }
        res.status(200).json({ success: true, data: updatedVidhan });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});



// Delete a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedVidhan = await NewsVidhan.findByIdAndDelete(req.params.id);
        if (!deletedVidhan) {
            return res.status(404).json({ success: false, message: 'Vidhan not found' });
        }
        res.status(200).json({ success: true, message: 'Vidhan deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
