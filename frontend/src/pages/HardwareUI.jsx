import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function HardwareUI() {
    const navigate = useNavigate()

    // See which tab is active
    const [activeTab, setActiveTab] = useState("projects"); // 'Projects' and 'resources' so default is Projects

    return (
        // Main header
        <div style={{padding: "40px", width: "200%"}}>
            <div style={{ marginBottom: "20px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                <div>
                    <h1 style={{margin: 0, fontSize: "30px", fontWeight: 500}}>
                        Hardware Resource Manager
                    </h1>
                    <p style={{ margin: "10px 0 0 0"}}> Logged in as: (placeholder)</p>

                </div>

                    { /* Navigate to homepage if you want to log out */}
                    <button
                        onClick={ () => navigate("/")}
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
                        LOGOUT
                    </button>
                </div>
            </div>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "12px", marginTop: "20px", marginBottom: "20px" }}>
                <button
                    onClick={() => setActiveTab("projects")}
                    style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fontWeight: "700",
                        backgroundColor: activeTab === "projects" ? "#0000ff" : "white",
                        color: activeTab === "projects" ? "white" : "black",
                    }}
                >
                    PROJECTS
                </button>

                <button
                    onClick={() => setActiveTab("resources")}
                    style={{
                        padding: "10px 18px",
                        borderRadius: "10px",
                        border: "1px solid #ccc",
                        cursor: "pointer",
                        fontWeight: "700",
                        backgroundColor: activeTab === "resources" ? "#0000ff" : "white",
                        color: activeTab === "resources" ? "white" : "black",
                    }}
                >
                    RESOURCES
                </button>
            </div>
            {/* Tab content */}
            {activeTab === "projects" ? (
                <div style={{ border: "1px solid #ddd", padding: "24px", borderRadius: "10px" }}>
                    <h2 style={{ marginTop: 0 }}>Projects</h2>
                    <p>Create project form + existing projects list will go here.</p>
                </div>
            ) : (
                <div style={{ border: "1px solid #ddd", padding: "24px", borderRadius: "10px" }}>
                    <h2 style={{ marginTop: 0 }}>Resources</h2>
                    <p>Select project + check in/out hardware sets will go here.</p>
                </div>
            )}
        </div>

    )
}