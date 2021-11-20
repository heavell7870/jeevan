const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: { type: String, required: true },
    father: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    district: { type: String, required: true },
    image: { type: String, required: true },
    dob: { type: Date, required: true },
    created: { type: Date, required: true },
    updated: { type: Date, required: true },
    expires: { type: Date, required: true },
    id: { type: String, required: true, unique:true },
    created_by: { type: String, required: true },
}, {
    collection: 'cards'
});

const model = mongoose.model('CardSchema', CardSchema);

module.exports = model;