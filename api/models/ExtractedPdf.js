const mongoose =  require('mongoose');

const ExtractedSchema = mongoose.Schema({
    ExtractedPdfUrl: String
},
{
    Timestamps:true
})
const ExtractedPdf = mongoose.model('ExtractedPdf',ExtractedSchema)

module.exports = ExtractedPdf;