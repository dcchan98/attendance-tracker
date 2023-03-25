import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [result, setResult] = useState([]);
  const [extraAttendees, setExtraAttendees] = useState([]);

  const calculateDifference = () => {
    const leftNames = leftText.split('\n').filter(name => name.trim());
    const rightNames = rightText.split('\n').filter(name => name.trim());
    const difference = leftNames.filter(name => !rightNames.includes(name));
    const extra = rightNames.filter(name => !leftNames.includes(name));
    setResult(difference);
    setExtraAttendees(extra);
  };

  const onDrop = (event, setText) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    Tesseract.recognize(file)
      .then(({ data: { text } }) => {
        setText(text);
      })
      .catch(err => console.error(err));
  };

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const leftNames = leftText.split('\n').filter(name => name.trim());
  const rightNames = rightText.split('\n').filter(name => name.trim());

  return (
    <div className="App">
      <div className="inputs">
        <textarea
          placeholder="Enter full strength names here"
          value={leftText}
          onChange={e => setLeftText(e.target.value)}
          onDrop={e => onDrop(e, setLeftText)}
          onDragOver={onDragOver}
        />
        <textarea
          placeholder="Enter attended names here"
          value={rightText}
          onChange={e => setRightText(e.target.value)}
          onDrop={e => onDrop(e, setRightText)}
          onDragOver={onDragOver}
        />
      </div>
      <button onClick={calculateDifference}>Calculate Difference</button>
      <table className="info">
        <thead>
          <tr>
            <th>Full strength size</th>
            <th>Current attendance size</th>
            <th>Number of missing attendees</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{leftNames.length}</td>
            <td>{rightNames.length}</td>
            <td>{result.length}</td>
          </tr>
        </tbody>
      </table>
      <div className="result">
        <p>Names not in attendance:</p>
        <ul>
          {result.map(name => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="extra-attendees">
        <p>Attendees not in the full strength list:</p>
        <ul>
          {extraAttendees.map(name => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
