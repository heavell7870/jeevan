const mongoose = require('mongoose');

const DistrictSchema = new mongoose.Schema({
    state: {type: String, required:true},
    district: {type: String, required:true },
},{
    collection: 'districts'
});

const model = mongoose.model('DistrictSchema', DistrictSchema);

module.exports = model;