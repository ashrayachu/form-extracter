const express = require('express');
const app = express();
const cors = require('cors')
const multer  = require('multer')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const {PDFDocument} = require('pdf-lib');  


const PDF = require('./models/Pdf');
const EPDF = require('./models/ExtractedPdf');
const ExtractedPdf = require('./models/ExtractedPdf');


const fs = require('fs').promises;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/mergedPdf', express.static(__dirname + '/mergedPdf'))
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

app.post('/pages',async(req, res)=>{
const pdfUrls  = req.body;


try{
  const mergedPdf = await PDFDocument.create();
      for(const pdfUrl of pdfUrls){
        const splitUrl =  pdfUrl.split('/')
        urlPath = splitUrl[4]
        // console.log(urlPath)
        const fileBytes =await fs.readFile(`splitpdfs/${urlPath}`)
         const pdfBytes = await PDFDocument.load(fileBytes)
        //  console.log(pdfBytes)
        const copiedPage = await mergedPdf.copyPages(pdfBytes,[0]);
        mergedPdf.addPage(copiedPage[0]);
      }
      const mergedPdfBytes = await mergedPdf.save()
      const fileName = `mergedPdf${Date.now()}.pdf`;
      const filePath = `./mergedPdf/${fileName}`;
      await fs.writeFile(filePath, mergedPdfBytes);
      const fileUrl = `http://localhost:3000/mergedPdf/${fileName}`;
      // res.json(fileUrl)
      try{
         const EPDFDoc = await EPDF.create({ExtractedPdfUrl: fileUrl})
         res.json( {id: EPDFDoc._id})
      }
      catch(e){
        res.status(500).json("Could not create database collection of extracted url")
      }

  }
catch(e){
  res.status(500).json("Could not merge document") 
}
})

app.post('/downloadform/:id',async(req, res)=>{
  const {id} =  req.params
  const mergedPdfDoc =  await EPDF.findById(id)
  res.json(mergedPdfDoc)
})


app.listen(3000)

