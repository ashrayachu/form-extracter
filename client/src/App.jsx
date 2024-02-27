
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import AddForm from './components/AddForm'
import ExtractedForm from './components/ExtractedForm'


function App() {


  return (
    <div className="App">
  <Router>
    <Routes>
      <Route exact='/' path='/'element={<AddForm/>}/>
      <Route path='/getform/:id' element={<ExtractedForm/>}/>
     
    </Routes>
  </Router>
  </div>
  )
}

export default App
