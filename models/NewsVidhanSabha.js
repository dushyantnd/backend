const mongoose = require('mongoose');

const newsVidhanSabhaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    vidhan_id: { type: mongoose.Schema.Types.ObjectId, ref: 'NewsVidhan', default: null },
}, { timestamps: true });

module.exports = mongoose.model('NewsVidhanSabha', newsVidhanSabhaSchema);
