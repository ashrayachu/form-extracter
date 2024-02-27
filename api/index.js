const express = require('express');
const app = express();
const cors = require('cors')
const multer  = require('multer')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {PDFDocument} = require('pdf-lib');  


const PDF = require('./models/Pdf');

const fs = require('fs').promises;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/splitpdfs', express.static(__dirname + '/splitpdfs'))


mongoose.connect('mongodb+srv://ashray:3YfQnN2pwfJOkCwa@cluster0.htyhxrt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() 
      cb(null,uniqueSuffix + file.originalname  )
    }
  })

  const upload = multer({ storage: storage })

app.post('/post', upload.single('file'), async(req, res)=>{
  const {path} = req.file
  console.log(path)
  try{
    const data = await PDF.create({ path })
    res.json(data)
  }
  catch(e){
    res.status(500).json("Could not upload")
  }
})

app.post('/post/:id',async (req,res)=>{
   const {id} = req.params
   try{
     data = await PDF.findById(id)
    //  res.json(data)
     const pdfPath = data.path
     
     const pdfBytes = await fs.readFile(pdfPath);

     // Load the PDF document
     const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
     
     const singlePageURL = [];
     
     for (let pageNumber = 0; pageNumber < pdfDoc.getPageCount(); pageNumber++){
         
         const singlePageDoc = await PDFDocument.create();
         const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [pageNumber]);
         singlePageDoc.addPage(copiedPage);
         const singlePageBytes = await singlePageDoc.save();
         const fileName = `split_${pageNumber + 1}.pdf`;
         const filePath = `./splitpdfs/${fileName}`;
         await fs.writeFile(filePath, singlePageBytes);
         const fileUrl = `http://localhost:3000/splitpdfs/${fileName}`;
         singlePageURL.push(fileUrl)
        }
    
  res.json(singlePageURL)
    //  return images;
    }
   catch(e){
    console.log(e)
   }
})

app.post('/pages',upload.single(pdfUrls),async(req, res)=>{
  const {pdfUrls} = req.body;
  console.log('Type of pdfUrls:', typeof pdfUrls);
  try {
    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();
    
    // Iterate through each PDF URL
    for (const pdfUrl of pdfUrls) {
      // Fetch the PDF data from the URL (you may need to use a library like Axios for this)
      // For demonstration purposes, I'm assuming you already have the PDF data
      const pdfBytes = await fetchPdfFromUrl(pdfUrl);

      // Load the fetched PDF data
      const pdfDoc = await PDFDocument.load(pdfBytes);

      // Iterate through each page of the PDF and copy it to the merged PDF
      for (const [pageIndex, pdfPage] of pdfDoc.getPages().entries()) {
        const copiedPage = await mergedPdf.copyPages(pdfDoc, [pageIndex]);
        mergedPdf.addPage(copiedPage[0]);
      }
    }

    // Serialize the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    const fileName = `${Date.now()}_merge.pdf`;
    const filePath = `./mergepdf/${fileName}`;
    await fs.writeFile(filePath, mergedPdfBytes);
    
    const outputFile = 'merged_pdf.pdf';
    console.log(outputFile)

    
   
  }
   catch (error) {
    console.error('Error combining PDFs:', error);
    res.status(500).json({ error: 'An error occurred while combining PDFs.' });
  }
})


app.listen(3000)

