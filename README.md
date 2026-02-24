# Hardware Resource Manager - ECE 461L (Dr. Samant)

## Overview
The Hardware Resource Manager is a MVP web application that allows teams to manage shared hardware resources across projects.  
Users will be able to create projects, view available hardware sets, and check hardware in and out.

## Features
- User account creation with data storage (backend)
- Create and manage projects
- View shared hardware inventory
- Check hardware sets in and out
- Track hardware availability and capacity
- Shared resource visibility between users and projects
  
## Technicals

### Frontend
- React (Javascript)
- CSS

### Backend
- MongoDB
- Python (Flask)
- Java (for supporting services or APIs if needed)

### Version Control
- Git & GitHub

## Running the Project Locally

### 1. Clone the repository
```bash
git clone https://github.com/<your-org>/ECE-461L-Project-18470-.git
cd ECE-461L-Project-18470-/frontend
```
### 2. Install frontend dependencies
```bash
npm install
npm run dev
```
### 3. Start React development server on your local machine
```bash
npm run dev
```

NOTE: The frontend should run at http://localhost:5173


## Current Status

- Homepage, Login, and Signup UI implemented
- - Backend database collection started
