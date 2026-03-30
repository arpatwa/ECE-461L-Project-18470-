import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({input}),
    });
    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Your Input Request to Server:
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <div>
        Response from server: {response}
    </div>
  </div>
  );
}

export default App;