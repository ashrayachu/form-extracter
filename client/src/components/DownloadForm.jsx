

import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

//dependencies required to display pdf
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

function DownloadForm() {
  const {id} = useParams()
  const [pdfUrl, setPdfUrl] = useState('')
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

 

  useEffect(()=>{
     fetch(`http://localhost:3000/downloadform/${id}`,{
      method:'post'
     }).then(response => response.json()
     .then( result =>setPdfUrl(result.ExtractedPdfUrl)))
  },[])

  const onDocumentLoadSuccess = ({ numPages }) => {
		setNumPages(numPages);
	};

  const goToPrevPage = () => setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

const goToNextPage = () =>
setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
  );

  return (
    <section className='Download-section'>
    <div className='Download-div'>
    <nav className='Download-nav'>
      <div className='nav-button'>
         <button onClick={goToPrevPage}
            className='black-btn'>Prev</button>

         <button onClick={goToNextPage}
            className='black-btn'>Next</button>
      </div>
      <p className='Pdf-pageNum'>
        Page {pageNumber} of {numPages}
      </p>
    </nav>
   <div className='file-container'>
      <Document className="file-viewer"
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
       >
         <Page pageNumber={pageNumber} height={600}/>
      
      </Document>
    </div>
    <button className='download-btn' onClick={()=>window.open(pdfUrl)}>Download</button>
  </div>
  </section>
  
  )
}

export default DownloadForm