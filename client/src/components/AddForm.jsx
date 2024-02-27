
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
  }).then(response=>{
    response.json().then(data=>{
     setId(data._id);
     setRedirect(true)
    })
    })

}
if(redirect){
  return <Navigate to={`/getForm/${id}`}/>
}


  return (
    <div className='AddForm'>
     <form className='AddForm-Form' onSubmit={uploadForm}>
      <div className="heading">
         <h1>Add pdf file to be extracted</h1>
      </div>
      <div className="file-input">
        <input  id="file-button"type="file" accept='.pdf' 
        onChange={(e)=>setFile(e.target.files[0])} />
      </div>
     <button>Upload PDF</button>
     </form>
    
    </div>
  
  )
}

export default AddForm