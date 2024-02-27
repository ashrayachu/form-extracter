

import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { Document, Page } from 'react-pdf';

import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


function ExtractedForm() {
  const {id} = useParams()
  const [path, setPath] = useState('')
  const [selectedPages, setSelectedPages] = useState([]);
 
  useEffect(() => {
    fetch(`http://localhost:3000/post/${id}`, {
      method: 'POST',
    })
    .then(response=>{
      response.json().
      then(data => setPath(data))
    })

  }, []);
  // console.log(path)

  
  const handleCheckboxChange = (item) => {
    setSelectedPages(prevSelectedPages => {
      const isSelected = prevSelectedPages.some(prevItem => prevItem === item);
      if (isSelected) {
        return prevSelectedPages.filter(prevItem => prevItem !== item);
      } else {
        return [...prevSelectedPages, item];
      }
    });
  };
  function handleExtract (){
    const requestBody = { selectedPages };
    const response = fetch('http://localhost:3000/pages',{
      method: 'POST',
      headers: {
              'Content-Type': 'application/json'
               },
       body: JSON.stringify(requestBody)  
    })
  }
 
  return (
    <div className='ExtractPage'>
       <h1 className='heading'>Select the pages to be extracted and click extract</h1>
       <button className='black-btn' onClick={handleExtract}> extract</button>
       <div className='extract-div'>
       {path && (
             path.map((item, index) => (
            <div key ={index} className='extract-card'> 
               <Document file={item}  className='extract-doc'>
                  <Page  className='extract-page' height="400" pageNumber={1}/>
               </Document>
            <div className="input-label">
              <span>{index + 1}</span>
              <label>Select Page</label>
               <input type="checkbox"
                checked={selectedPages.some(selectedItem => selectedItem === item)}
                onChange={() => handleCheckboxChange(item)} />
             </div>
            </div>
           
           
    )))}
    </div>

</div>
  )
}

export default ExtractedForm