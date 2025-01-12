const mongoose = require('mongoose');

const newsCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    post_counts: { type: Number, },
    parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'NewsCategory', default: null },
}, { timestamps: true });

module.exports = mongoose.model('NewsCategory', newsCategorySchema);
