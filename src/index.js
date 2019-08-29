import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import { conditionalExpression } from "@babel/types";

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};

function App() {
  const [selectedFile, selectFile] = useState("");
  const handleSubmit = e => {
    const event = e;
    event.preventDefault();
    console.log(selectedFile.substring(0, 30));
    // in case I want to access child state from parent. use hidden target input in the form element.
    // console.log("event.target>>", event.target.fileString.value);
    console.log("submitted!");
  };

  const onHandleClick = () => {
    console.log(selectedFile.substring(0, 30));
    const shortenedFile = selectedFile.replace("data:text/csv;base64,", "");
    const myBlob = b64toBlob(shortenedFile, { type: "text/csv" });
    window.navigator.msSaveBlob(myBlob, "myFile.csv");
  };

  const handleChange = e => {
    const file = e.target.files[0];
    console.log("file type>>>", file.type);
    if (file.type === "text/csv" || file.type === "application/vnd.ms-excel") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        const file = e.target.result;
        const newFile = file.replace("application/vnd.ms-excel", "text/csv");
        selectFile(newFile);
      };
    } else {
      selectFile("");
    }
  };

  return (
    <div className="App">
      <h1>File Upload with React- Simple Example</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="fileString"
          value={selectedFile}
          readOnly
          style={{ display: "none" }}
        />
        <input
          name="csvFile"
          type="file"
          onChange={handleChange}
          accept=".csv"
        />
        <button type="submit">Submit</button>
      </form>
      {window.navigator.msSaveBlob && selectedFile && (
        <button onClick={onHandleClick}>download</button>
      )}
      {!window.navigator.msSaveBlob && selectedFile && (
        <a href={selectedFile} download="myFile.csv">
          Download this
        </a>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
