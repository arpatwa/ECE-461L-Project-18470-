import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Homepage() {
    const navigate = useNavigate();

    const features = [
        "Create user accounts with password storage",
        "Create and manage projects",
        "Check out/in hardware",
        "View hardware capacity and availability",
        "Navigate resources across all projects",
    ];

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

        <h1 style={{ fontSize: "50px", fontWeight: "400",
        margin: "0 0 25px 0"}}> Hardware Resource Manager</h1>

        <p style={{ fontSize: "20px", margin: "0 0 35px 0"}}>
            MVP - This web application allows for managing hardware resources across projects
        </p>

        <div style={{ display: "flex", gap: "15px" }}>
            <button
                onClick={() => navigate("/login")}
                style={{
                    backgroundColor: "#0000ff",
                    color: "white",
                    padding: "12px 22px",
                    borderRadius: "10px",
                    border: "none",
                    fontWeight: "700",
                    cursor: "pointer",
                }}
            >
                LOGIN
            </button>

            <div style={{ display: "flex", gap: "15px" }}>
                <button
                    onClick={() => navigate("/signup")}
                    style={{
                        backgroundColor: "#0000ff",
                        color: "white",
                        padding: "12px 22px",
                        borderRadius: "10px",
                        border: "none",
                        fontWeight: "700",
                        cursor: "pointer",
                    }}
                >
                    SIGN UP
                </button>
            </div>



    </div>
    </div>
            <div
                style={{
                    border: "2px solid black",
                    marginBottom: "40px",
                    padding: "50px 60px",
                    width: "1300px"
                }}
            >
                <div className="features-container">
                    <h2>Features:</h2>

                    <ul>
                        {features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}