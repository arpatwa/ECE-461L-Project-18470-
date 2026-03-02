import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function HardwareUI() {
    const navigate = useNavigate()

    // See which tab is active
    const [activeTab, setActiveTab] = useState("projects"); // 'Projects' and 'resources' so default is Projects

    //project form state
    const [projectID, setProjectID] = useState("");
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");


    const handleCreateProject = () => {
    if (!projectID || !projectName) {
        setMessage("Project ID and Name required");
        return;
    }

    // will call backend API later on
    setMessage(`Project created: ${projectName}`);

    // clear form
    setProjectID("");
    setProjectName("");
    setDescription("");
    };

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
        <h2 style={{ marginTop: 0 }}>CREATE NEW PROJECT</h2>

        {/* Project ID */}
        <p>Project ID</p>
        <input
            value={projectID}
            onChange={(e) => setProjectID(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        {/* Project Name */}
        <p>Project Name</p>
        <input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        {/* Description */}
        <p>Description (optional)</p>
        <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description..."
            style={{ width: "100%", padding: "10px", marginBottom: "15px", fontFamily: "inherit", fontSize: "16px"}}
        />

        {/* Success Message */}
        {message && (
            <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
                {message}
            </div>
        )}

        {/* Create Button */}
        <button
            onClick={handleCreateProject}
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
            CREATE PROJECT
        </button>
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