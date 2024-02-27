const mongoose = require('mongoose')

const pdfSchema = new mongoose.Schema({
    path: String,
},
{
    timestamps:true
})

const PDF = mongoose.model('PDF',pdfSchema)
module.exports = PDF;