import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function HardwareUI() {
    const navigate = useNavigate()
    const username = localStorage.getItem("username");

    // See which tab is active
    const [activeTab, setActiveTab] = useState("projects"); // 'Projects' and 'resources' so default is Projects

    //project form state
    const [projectID, setProjectID] = useState("");
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    // Resource tab state palceholder (before backend integration)

    const [selectedProject, setSelectedProject] = useState("app (001)");
    const [resourceMessage, setResourceMessage] = useState("SUCCESS: Checked out 25 units of HWSet1");

    const [hardwareSets, setHardwareSets] = useState([
        {
            name: "HWSet1",
            capacity: 100,
            available: 75,
            inUse: 25,
            yourProject: 25,
            checkoutQty: "25",
            checkinQty: "",
            projectsUsing: 1,
        },
        {
            name: "HWSet2",
            capacity: 100,
            available: 100,
            inUse: 0,
            yourProject: 0,
            checkoutQty: "",
            checkinQty: "",
            projectsUsing: 0,
        },
    ]);

    const [userProjects, setUserProjects] = useState([]);

    const handleCreateProject = async () => {
        if (!projectID || !projectName) {
            setMessage("Project ID and Name required");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:5000/projects", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: projectName,
                    owner: username, //need this for backend connection
                }), 
            }); 

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.error || "Failed to create project");
                return;
            }

            setMessage(`Project created: ${projectName}`); 

            // clear form
            setProjectID("");
            setProjectName("");
            setDescription("");
        } catch(err) {
            console.error(err);
            setMessage("Server error creating project"); 
        }

    };

    // Resource manager
    const handleResourceInputChange = (index, field, value) => {
        const updatedSets = [...hardwareSets];
        updatedSets[index][field] = value;
        setHardwareSets(updatedSets);
    };

    const handleCheckout = (index) => {
        const updatedSets = [...hardwareSets];
        const qty = Number(updatedSets[index].checkoutQty);

        if (!qty || qty <= 0) {
            setResourceMessage(`ERROR: Enter a valid checkout quantity for ${updatedSets[index].name}`);
            return;
        }

        if (qty > updatedSets[index].available) {
            setResourceMessage(`ERROR: Not enough available units in ${updatedSets[index].name}`);
            return;
        }
// Manual integration for frontend quantity updates (PLACEHOLDER)
        updatedSets[index].available -= qty;
        updatedSets[index].inUse += qty;
        updatedSets[index].yourProject += qty;

        if (updatedSets[index].yourProject === qty) {
            updatedSets[index].projectsUsing += 1;
        }

        updatedSets[index].checkoutQty = "";
        setHardwareSets(updatedSets);
        setResourceMessage(`SUCCESS: Checked out ${qty} units of ${updatedSets[index].name}`);
    };

    const handleCheckin = (index) => {
        const updatedSets = [...hardwareSets];
        const qty = Number(updatedSets[index].checkinQty);

        if (!qty || qty <= 0) {
            setResourceMessage(`ERROR: Enter a valid check in quantity for ${updatedSets[index].name}`);
            return;
        }

        if (qty > updatedSets[index].yourProject) {
            setResourceMessage(`ERROR: Your project does not have that many units of ${updatedSets[index].name}`);
            return;
        }

        updatedSets[index].available += qty;
        updatedSets[index].inUse -= qty;
        updatedSets[index].yourProject -= qty;

        if (updatedSets[index].yourProject === 0 && updatedSets[index].projectsUsing > 0) {
            updatedSets[index].projectsUsing -= 1;
        }

        updatedSets[index].checkinQty = "";
        setHardwareSets(updatedSets);
        setResourceMessage(`SUCCESS: Checked in ${qty} units of ${updatedSets[index].name}`);
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
                    <p style={{ margin: "10px 0 0 0"}}> Logged in as: {username || "Not logged in"}</p>

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

                //Resource Ui integeration
            ) : (
                /* Active Project Selector
           Allows user to choose which project
           hardware will be checked in/out for */
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ border: "1px solid #000", padding: "20px", backgroundColor: "#f7f7f7" }}>
                        <label style={{ fontWeight: "700", marginRight: "10px" }}>Active Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            style={{
                                padding: "10px",
                                minWidth: "220px",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                fontSize: "16px",
                                backgroundColor: "white",
                            }}
                        >
                            {userProjects.map((project, index) => (
                                <option key={index} value={project}>
                                    {project}
                                </option>
                            ))}
                        </select>
                    </div>

                    {resourceMessage && (
                        <div style={{ border: "1px solid #ddd", padding: "18px", backgroundColor: "#fafafa" }}>
                            {resourceMessage}
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        {hardwareSets.map((set, index) => (
                            <div
                                key={set.name}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "24px",
                                    width: "570px",
                                    backgroundColor: "white",
                                }}
                            >
                                <h2 style={{ marginTop: 0, marginBottom: "18px", fontWeight: "500" }}>{set.name}</h2>

                                <div
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "18px",
                                        marginBottom: "18px",
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    <p style={{ margin: "6px 0" }}><strong>Capacity:</strong> {set.capacity} units</p>
                                    <p style={{ margin: "6px 0" }}><strong>Available:</strong> {set.available} units</p>
                                    <p style={{ margin: "6px 0" }}><strong>In Use:</strong> {set.inUse} units</p>

                                    <p style={{ marginTop: "18px", marginBottom: "6px" }}>
                                        <strong>Your Project:</strong> {set.yourProject} units
                                    </p>
                                </div>

                                <div style={{ marginBottom: "18px" }}>
                                    <p style={{ marginBottom: "8px" }}>Check Out Units</p>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            value={set.checkoutQty}
                                            onChange={(e) =>
                                                handleResourceInputChange(index, "checkoutQty", e.target.value)
                                            }
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                border: "1px solid #eee",
                                                borderRadius: "10px",
                                                backgroundColor: "#f5f5f5",
                                            }}
                                        />
                                        <button
                                            onClick={() => handleCheckout(index)}
                                            style={{
                                                backgroundColor: "#0000ff",
                                                color: "white",
                                                padding: "12px 20px",
                                                borderRadius: "10px",
                                                border: "none",
                                                fontWeight: "700",
                                                cursor: "pointer",
                                            }}
                                        >
                                            CHECK OUT
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p style={{ marginBottom: "8px" }}>Check In Units</p>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            value={set.checkinQty}
                                            onChange={(e) =>
                                                handleResourceInputChange(index, "checkinQty", e.target.value)
                                            }
                                            style={{
                                                flex: 1,
                                                padding: "12px",
                                                border: "1px solid #eee",
                                                borderRadius: "10px",
                                                backgroundColor: "#f5f5f5",
                                            }}
                                        />
                                        <button
                                            onClick={() => handleCheckin(index)}
                                            disabled={set.yourProject === 0}
                                            style={{
                                                backgroundColor:  "#0000ff",
                                                color: "WHITE",
                                                padding: "12px 20px",
                                                borderRadius: "10px",
                                                border: "none",
                                                fontWeight: "700",
                                                cursor: set.yourProject === 0 ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            CHECK IN
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ border: "1px solid #ddd", padding: "24px" }}>
                        <h2 style={{ marginTop: 0, marginBottom: "18px" }}>GLOBAL HARDWARE STATUS</h2>

                        <div style={{ display: "flex", gap: "60px", flexWrap: "wrap" }}>
                            {hardwareSets.map((set) => (
                                <div key={set.name} style={{ minWidth: "260px" }}>
                                    <h3 style={{ marginBottom: "10px", fontWeight: "500" }}>{set.name}</h3>
                                    <p style={{ margin: "6px 0" }}>Total: {set.capacity}</p>
                                    <p style={{ margin: "6px 0" }}>Available: {set.available}</p>
                                    <p style={{ margin: "6px 0" }}>Checked Out: {set.inUse}</p>
                                    <p style={{ margin: "6px 0" }}>Projects Using: {set.projectsUsing}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
        

    )
}