// api.js

// Dynamically choose backend URL based on environment
export const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:5000" // local dev backend
    : "https://apricot-tart-74890-3cafeb8efb3e.herokuapp.com/"; // replace with your actual Heroku app URL

// ---- AUTH ----
export async function signupUser(username, password) {
    const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

export async function loginUser(username, password) {
    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    return res.json();
}

// ---- PROJECTS ----
export async function fetchProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`);
    return res.json();
}

export async function joinProject(projectID, username) {
    const res = await fetch(`${API_BASE_URL}/projects/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID, username }),
    });
    return res.json();
}

export async function createProject(project) {
    const res = await fetch(`${API_BASE_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
    return res.json();
}

// ---- RESOURCES ----
export async function fetchProjectResources(projectID, username) {
    const res = await fetch(`${API_BASE_URL}/resources/${projectID}?username=${username}`);
    return res.json();
}

export async function checkoutHardware({ projectID, username, name, qty }) {
    const res = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID, username, name, qty }),
    });
    return res.json();
}

export async function checkinHardware({ projectID, username, name, qty }) {
    const res = await fetch(`${API_BASE_URL}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectID, username, name, qty }),
    });
    return res.json();
}