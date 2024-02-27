
import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'



function AddForm() {
const [file,setFile] = useState(null)
const[redirect, setRedirect] = useState(false)
const[id, setId] = useState("")


 function uploadForm(e){
  e.preventDefault();
  const data = new FormData();
   data.set('file',file)
 fetch('http://localhost:3000/post',{
  method:'POST',
  body:data
  }) .then(response => {
    if (!response.ok) {
      alert("Could not complete request! try again")
    }
    return response.json();
  })
  .then(data => {
    setId(data._id);
    setRedirect(true);
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });

}
if(redirect){
  return <Navigate to={`/getForm/${id}`}/>
}


  return (
    <div className='AddForm'>
     <form className='AddForm-Form' onSubmit={uploadForm}>
      <div className="heading">
         <h1 className='text-5xl p-10'>
          <span className='font-extrabold text-red-800'>PDF</span> Extracter</h1>
      </div>
      <div className="desc">
      Unlock the power of precision with our app! Seamlessly
       extract pages from PDFs and craft custom documents with ease. Experience 
      efficiency redefined as you create personalized PDFs tailored to your exact needs
      </div>
   
      <div className="file-input">
        <input  id="file-button"type="file" accept='.pdf' 
        onChange={(e)=>setFile(e.target.files[0])} 
        required/>
      </div>
     <button className='black-btn'>Upload PDF</button>
     </form>
    
    </div>
  
  )
}

export default AddForm