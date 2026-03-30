// client/src/App.js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // -----------------------------
  // States
  // -----------------------------
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState([]);
  const [newProjectID, setNewProjectID] = useState("");
  const [newProjectName, setNewProjectName] = useState("");

  // -----------------------------
  // Call /api
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      console.error(err);
      setResponse("Error connecting to server");
    }
  };

  // -----------------------------
  // Signup
  // -----------------------------
  const handleSignup = async () => {
    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password, // send plaintext for now; your RSA frontend can encrypt if needed
        }),
      });
      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Login
  // -----------------------------
  const handleLogin = async () => {
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Get projects
  // -----------------------------
  const getProjects = async () => {
    try {
      const res = await fetch("/projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Create project
  // -----------------------------
  const createProject = async () => {
    try {
      const res = await fetch("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectID: newProjectID,
          name: newProjectName,
          owner: username,
        }),
      });
      const data = await res.json();
      alert(data.message || data.error);
      getProjects();
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Load projects on mount
  // -----------------------------
  useEffect(() => {
    getProjects();
  }, []);

  return (
    <div className="App">
      <h1>Hardware Resource System Frontend</h1>

      <section>
        <h2>Test /api</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
        <p>Response: {response}</p>
      </section>

      <section>
        <h2>Signup / Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSignup}>Signup</button>
        <button onClick={handleLogin}>Login</button>
      </section>

      <section>
        <h2>Projects</h2>
        <input
          type="text"
          placeholder="Project ID"
          value={newProjectID}
          onChange={(e) => setNewProjectID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Project Name"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
        />
        <button onClick={createProject}>Create Project</button>

        <h3>Existing Projects</h3>
        <ul>
          {projects.map((p) => (
            <li key={p.projectID}>
              {p.projectID} - {p.name} (Owner: {p.owner})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;