const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    titre : { type: String, required: true },
    contenu : { type: String, required: true },
    type : { type: String},
    createdAt : { type: Date, default: Date.now }
});


module.exports = mongoose.model('Document', documentSchema);