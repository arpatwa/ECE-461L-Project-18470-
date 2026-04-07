import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { API_BASE_URL } from "../api"; 
import React from "react";

//RSA PUBLIC KEY
    const n = 3233;
    const e = 17;

    function rsaEncrypt(password) {
        return password
            .split("")
            .map(char => Math.pow(char.charCodeAt(0), e) % n)
            .join(",");
    }

export default function Signup() {
    const navigate = useNavigate();
    
    // State to hold form data
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Placeholder for authentication logic
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
        const response = await fetch(`${API_BASE_URL}/login`, {
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
            alert("Signup successful!");
            navigate("/login");
        } else {
            alert(data.error || "Signup failed");
        }
        } catch (err) {
            console.error("Error during signup:", err);
        }
        // console.log("Submitting:", formData);
        // After successful signup, you could navigate to login or home:
        // navigate("/login");
    };

    //Buttons for Registering and Canceling
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
                    Create an Account
                </h1>

                <p style={{ fontSize: "20px", margin: "0 0 35px 0" }}>
                    Sign up to start managing hardware resources across your projects.
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

                    <div>
                        <label style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={inputStyle}
                            required
                        />
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "15px" }}>
                        <button type="submit" style={buttonStyle}>
                            REGISTER
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
                </form>
            </div>
        </div>
    );
}