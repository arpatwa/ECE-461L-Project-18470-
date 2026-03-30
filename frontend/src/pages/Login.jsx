import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import React from "react";

//using same format as the signin page :)

//RSA PUBLIC KEY
    const n = 3233;
    const e = 17;

    function rsaEncrypt(password) {
        return password
            .split("")
            .map(char => Math.pow(char.charCodeAt(0), e) % n)
            .join(",");
    }

export default function Login() {
    const navigate = useNavigate();

    // State to hold form data
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    //handle errors
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const USE_MOCK_LOGIN = true;

    // ... inside your Login component ...

const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: formData.username,
                password: rsaEncrypt(formData.password)
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Login was successful
            console.log("Login successful, user:", data.username);
            localStorage.setItem("username", data.username);
            navigate("/hardware");
        } else {
            // Backend returned an error (e.g., 401 Unauthorized)
            setError(data.error || "Login Failed");
        }
    } catch (err) {
        console.error("Login error:", err);
        setError("Server not running or unreachable");
    }
};

    //Buttons for Login
    const buttonStyle = {
        backgroundColor: "#0000ff",
        color: "white",
        padding: "12px 22px",
        borderRadius: "10px",
        border: "none",
        fontWeight: "700",
        cursor: "pointer",
    };

    //Input Boxes for user information
    const inputStyle = {
        display: "block",
        width: "100%",
        maxWidth: "400px",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "5px",
        border: "1px solid black",
        fontSize: "16px"
    };

    //Text
    const labelStyle = {
        display: "block",
        fontWeight: "600",
        marginBottom: "8px",
        fontSize: "18px"
    };


return (
    <div style={{ padding: "40px" }}>
        <div
            style={{
                border: "2px solid black",
                marginBottom: "40px",
                padding: "50px 60px",
                width: "1300px"
            }}
        >
            <h1 style={{ fontSize: "50px", fontWeight: "400", margin: "0 0 25px 0" }}>
                Login
            </h1>

            <p style={{ fontSize: "20px", margin: "0 0 35px 0" }}>
                Sign in to access your hardware resource dashboard.
            </p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label style={labelStyle}>Username / Email</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div>
                    <label style={labelStyle}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={inputStyle}
                        required
                    />
                </div>

                <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                    <button type="submit" style={buttonStyle}>
                        LOGIN
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        style={{
                            ...buttonStyle,
                            backgroundColor: "white",
                            color: "black",
                            border: "2px solid black",
                        }}
                    >
                        CANCEL
                    </button>
                </div>
                
                {error && (
                    <p style={{ color: "red", marginTop: "20px", fontWeight: "600" }}>
                        {error}
                        </p>
                )}
            </form>
        </div>
    </div>
);
}
