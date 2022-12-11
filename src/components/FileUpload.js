import React, { useState } from 'react';
import '../App.css';

function FileUpload(props) {
    const changeHandler = (event) => {
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = event => {
            props.readFile(event.target.result)
        };
    }

    return (
        <div className="fileUploadBox">
            <input type="file" name="file" accept="application/JSON" onChange={changeHandler} />
        </div>
    );
}

export default FileUpload;