import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

//using same format as the signin page :)

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

    const handleSubmit = async (e) => {
        console.log("SUBMIT CLICKED");
        e.preventDefault();

        setError(""); //get rid of old errors

        //DEMO MODE
        if (USE_MOCK_LOGIN) {
            if (formData.username === "demo" && formData.password === "123") {
                navigate("/hardware");
            } else {
                console.log("Setting error");
                setError("Invalid username or password");
            }
            return; //stops the real backend code from running
        }

        try{
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }); 
        

            const data = await response.json(); 

            if (response.ok){
                //login was successful
                console.log("Logging in:", formData);
                navigate("/hardware");
            } else{
                //show a backend error
                setError(data.error || "Login Failed"); 
            }
        } catch (err){
            setError("Server not running"); 
        }

        // Removed placeholder, now can go to hardware pages
        // After successful login, you could navigate to hardware pages:
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
