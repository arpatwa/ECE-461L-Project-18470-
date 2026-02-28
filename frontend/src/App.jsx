import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import HardwareUI from "./pages/HardwareUI.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/hardware" element={<HardwareUI />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}