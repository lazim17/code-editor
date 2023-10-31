import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';
import axios from 'axios';
import './CodeEditor.css';

const CodeEditor = () => {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [error, setError] = useState('');
  const [compilationMessage, setCompilationMessage] = useState('');

  const baseURL = 'http://localhost:5000';

  const compileCode = async () => {
    if (selectedLanguage) {
      try {
        const response = await axios.post(`${baseURL}/compile`, { code, language: selectedLanguage });
        if (response.data === 'Compilation Successful') {
          setCompilationMessage('Compilation Successful');
          setError('');
        } else {
          setCompilationMessage('Compilation Failed');
          setError(response.data);
        }
      } catch (error) {
        console.error(error);
        setCompilationMessage('An error occurred while checking the code.');
        setError(''); 
      }
    } else {
      setCompilationMessage('Please select a language.');
      setError(''); 
    }
  };

  const runCode = async () => {
    if (selectedLanguage) {
      try {
        const response = await axios.post(`${baseURL}/run`, { code, language: selectedLanguage });
        if (selectedLanguage === 'python') {
          if (response.data.error) {
            setError(response.data.error);
            setCompilationMessage(''); 
          } else {
            setError(''); 
            setCompilationMessage(''); 

          }
        }
        setOutput(response.data.output);
      } catch (error) {
        console.error(error);
        setOutput('An error occurred while running the code.');
        setError(''); 
        setCompilationMessage(''); 
      }
    } else {
      setOutput('Please select a language.');
      setError(''); 
      setCompilationMessage(''); 
    }
  };

  const editorOptions = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
  };

  return (
    <div>
      <h2>Code Editor</h2>
      <div className="editor-container">
        <div className="editor-sidebar">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">Select Language</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
          {selectedLanguage === 'cpp' && <button onClick={compileCode}>Compile</button>}
          <button onClick={runCode}>Run</button>
        </div>
        <div className="editor-content">
          <MonacoEditor
            language={selectedLanguage}
            theme="vs-dark"
            value={code}
            options={editorOptions}
            onChange={(newCode) => {
              setCode(newCode);
              setCompilationMessage(''); 
              setError('');
              setOutput('') 
            }}
          />
        </div>
      </div>
      <div className="output-container">
        <div className="command-prompt">
          {compilationMessage && <pre>{compilationMessage}</pre>}
          {error && <pre>{error}</pre>}
          {!error && <pre>{output}</pre>}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;