import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload'

function App() {

  const [sudoku, setSudoku] = useState({})
  const readFile = (fileObject) => {
    let file = JSON.parse(fileObject)
    setSudoku({...file})
    console.log(sudoku)
  }

  return (
    <div className="container">
        <FileUpload readFile={readFile}/>
    </div>
  );
}

export default App;
