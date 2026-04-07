import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
    fetchProjects as apiFetchProjects,
    fetchProjectResources as apiFetchProjectResources,
    checkoutHardware,
    checkinHardware,
    joinProject as apiJoinProject,
    createProject as apiCreateProject,
} from "./api"; // correct path

export default function HardwareUI() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    // See which tab is active
    const [activeTab, setActiveTab] = useState("projects"); // 'Projects' and 'resources' so default is Projects

    //project form state
    const [projectID, setProjectID] = useState("");
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    // Resource tab state
    const [selectedProject, setSelectedProject] = useState("");
    const [resourceMessage, setResourceMessage] = useState("");

    const [hardwareSets, setHardwareSets] = useState([]);
    // NEW STATE: Track the currently selected hardware set from the dropdown
    const [selectedHardwareIndex, setSelectedHardwareIndex] = useState(0);

    const [allProjects, setAllProjects] = useState([]);
    const [userProjects, setUserProjects] = useState([]);
    const [joinProjectName, setJoinProjectName] = useState("");

    const fetchProjects = async () => {
        const data = await apiFetchProjects();
        const projectsArray = Array.isArray(data) ? data : data.projects || [];
        setAllProjects(projectsArray);

        const joinedProjects = projectsArray.filter(
            (project) =>
                project.owner === username ||
                (Array.isArray(project.members) && project.members.includes(username))
        );

        setUserProjects(joinedProjects);
        setSelectedProject(joinedProjects[0]?.projectID || "");
    };
    // const fetchProjects = async () => {
    //     try {
    //         const res = await fetch("http://127.0.0.1:5000/projects");
    //         const data = await res.json();

    //         const projectsArray = Array.isArray(data) ? data : data.projects || [];

    //         setAllProjects(projectsArray);

    //         const joinedProjects = projectsArray.filter(
    //             (project) =>
    //                 project.owner === username ||
    //                 (Array.isArray(project.members) && project.members.includes(username))
    //         );

    //         setUserProjects(joinedProjects);

    //         if (joinedProjects.length > 0) {
    //             setSelectedProject(joinedProjects[0].projectID);
    //         } else {
    //             setSelectedProject("");
    //         }
    //     } catch (err) {
    //         console.error("Error fetching projects:", err);
    //     }
    // };
    const fetchProjectResources = async (projectID) => {
        if (!projectID) return;
        const data = await apiFetchProjectResources(projectID, username);
        if (data.error) {
            setResourceMessage(data.error);
            return;
        }

        const formatted = data.map((set) => ({ ...set, checkoutQty: "", checkinQty: "" }));
        setHardwareSets(formatted);
        setResourceMessage("");
    };

    // const fetchProjectResources = async (projectID) => {
    //     if (!projectID) return;

    //     try {
    //         const res = await fetch(`http://127.0.0.1:5000/resources/${projectID}?username=${username}`);
    //         const data = await res.json();

    //         if (!res.ok) {
    //             setResourceMessage(data.error || "Failed to load resources");
    //             return;
    //         }
    //         const formatted = data.map((set) => ({
    //             ...set,
    //             checkoutQty: "",
    //             checkinQty: ""
    //         }));

    //         setHardwareSets(formatted);
    //         setResourceMessage("");
            
    //         // Reset to the first hardware set if the current index is out of bounds after a fetch
    //         if (selectedHardwareIndex >= formatted.length) {
    //             setSelectedHardwareIndex(0);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         setResourceMessage("Server error loading resources");
    //     }
    // };

    useEffect(() => {
        const loadProjects = () => {
            fetchProjects();
        }
        loadProjects();
    }, []);

    useEffect(() => {
        const loadResources = async () => {
            if (selectedProject) {
                await fetchProjectResources(selectedProject);
            }
        };

        loadResources();
    }, [selectedProject]);

    // Be able to handle joining projects if already joined, joining new, non-existent project, etc
    const handleJoinProject = async () => {
        if (!joinProjectName) return setMessage("Please choose a project to join");
        const data = await apiJoinProject(joinProjectName, username);
        if (data.error) setMessage(data.error);
        else {
            setMessage(data.message || `Successfully joined project: ${joinProjectName}`);
            setJoinProjectName("");
            await fetchProjects();
        }
    };

    // const handleJoinProject = async () => {
    //     if (!joinProjectName) {
    //         setMessage("Please choose a project to join");
    //         return;
    //     }

    //     try {
    //         const r = await fetch("http://127.0.0.1:5000/projects/join", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 projectID: joinProjectName,
    //                 username: username,
    //             }),
    //         });

    //         const data = await r.json();

    //         if (!r.ok) {
    //             setMessage(data.error || "Failed to join project");
    //             return;
    //         }

    //         // Successful project join
    //         setMessage(data.message || `Successfully joined project: ${joinProjectName}`);
    //         setJoinProjectName("");
    //         await fetchProjects();
    //     } catch (err) {
    //         console.error(err);
    //         setMessage("Server error in joining the project");
    //     }

    // };

    // const handleCreateProject = async () => {
    //     if (!projectID || !projectName) {
    //         setMessage("Project ID and Name required");
    //         return;
    //     }

    //     try {
    //         const res = await fetch("http://127.0.0.1:5000/projects", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({
    //                 // Need all of these so each person only has access to their stuff
    //                 projectID: projectID,
    //                 name: projectName,
    //                 description: description,
    //                 owner: username, //need this for backend connection
    //             }),
    //         });

    //         const data = await res.json();

    //         if (!res.ok) {
    //             setMessage(data.error || "Failed to create project");
    //             return;
    //         }

    //         setMessage(`Project created: ${projectName}`);
    //         await fetchProjects();

    //         // clear form
    //         setProjectID("");
    //         setProjectName("");
    //         setDescription("");
    //     } catch (err) {
    //         console.error(err);
    //         setMessage("Server error creating project");
    //     }
    // };

    const handleCreateProject = async () => {
        if (!projectID || !projectName) return setMessage("Project ID and Name required");
        const data = await apiCreateProject({ projectID, name: projectName, description, owner: username });
        if (data.error) setMessage(data.error);
        else {
            setMessage(`Project created: ${projectName}`);
            setProjectID(""); setProjectName(""); setDescription("");
            await fetchProjects();
        }
    };

    // Resource manager
    const handleResourceInputChange = (index, field, value) => {
        const updatedSets = [...hardwareSets];
        updatedSets[index][field] = value;
        setHardwareSets(updatedSets);
    };

    const handleCheckout = async (index) => {
        const set = hardwareSets[index];
        const qty = Number(set.checkoutQty);
        if (!qty || qty <= 0) return setResourceMessage(`ERROR: Enter a valid checkout quantity for ${set.name}`);
        const data = await checkoutHardware({ projectID: selectedProject, username, name: set.name, qty });
        setResourceMessage(data.message || data.error);
        await fetchProjectResources(selectedProject);
    };

    // const handleCheckout = async (index) => {
    //     const set = hardwareSets[index];
    //     // String to num for qty
    //     const qty = Number(set.checkoutQty); // Get curr checkout value

    //     // Prevent empty, 0 , negative inputs
    //     if (!qty || qty <= 0) {
    //         setResourceMessage(`ERROR: Enter a valid checkout quantity for ${set.name}`);
    //         return;
    //     }
    //     // API call starting

    //     try {
    //         const res = await fetch("http://127.0.0.1:5000/checkout", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             // Send data to back
    //             body: JSON.stringify({
    //                 projectID: selectedProject,
    //                 username: username,
    //                 name: set.name,
    //                 qty: qty
    //             }),
    //         });

    //         // Back response into js
    //         const data = await res.json();

    //         if (!res.ok) {
    //             setResourceMessage(data.error || "Checkout failed");
    //             return;
    //         }

    //         setResourceMessage(data.message);
    //         // UI updated backend data
    //         await fetchProjectResources(selectedProject);
    //     } catch (err) {
    //         console.error(err);
    //         setResourceMessage("Server error during checkout");
    //     }
    // };

    // const handleCheckin = async (index) => {
    //     const set = hardwareSets[index];
    //     const qty = Number(set.checkinQty);

    //     if (!qty || qty <= 0) {
    //         setResourceMessage(`ERROR: Enter a valid check in quantity for ${set.name}`);
    //         return;
    //     }

    //     try {
    //         // Call backend
    //         const res = await fetch("http://127.0.0.1:5000/checkin", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             // Data to backend
    //             body: JSON.stringify({
    //                 projectID: selectedProject,
    //                 username: username,
    //                 name: set.name,
    //                 qty: qty
    //             }),
    //         });
    //         // Back response into js
    //         const data = await res.json();

    //         if (!res.ok) {
    //             setResourceMessage(data.error || "Checkin failed");
    //             return;
    //         }

    //         setResourceMessage(data.message);
    //         // UI updated backend data
    //         await fetchProjectResources(selectedProject);
    //     } catch (err) {
    //         // Cant connect server
    //         console.error(err);
    //         setResourceMessage("Server error during checkin");
    //     }
    // };

    const handleCheckin = async (index) => {
        const set = hardwareSets[index];
        const qty = Number(set.checkinQty);
        if (!qty || qty <= 0) return setResourceMessage(`ERROR: Enter a valid check in quantity for ${set.name}`);
        const data = await checkinHardware({ projectID: selectedProject, username, name: set.name, qty });
        setResourceMessage(data.message || data.error);
        await fetchProjectResources(selectedProject);
    };

    return (
        // Main header
        <div style={{ padding: "40px", width: "100%", boxSizing: "border-box" }}>
            <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: "30px", fontWeight: 500 }}>
                            Hardware Resource Manager
                        </h1>
                        <p style={{ margin: "10px 0 0 0" }}> Logged in as: {username || "Not logged in"}</p>

                    </div>

                    { /* Navigate to homepage if you want to log out */}
                    <button
                        onClick={() => {
                            localStorage.removeItem("username");
                            navigate("/");
                        }} // Logout and removed saved user name
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
                        style={{ width: "100%", padding: "10px", marginBottom: "15px", fontFamily: "inherit", fontSize: "16px" }}
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

                    {/* Join a project frontend */}
                    <div style={{ marginTop: "30px", borderTop: "1px solid #ddd", paddingTop: "24px" }}>
                        <h2 style={{ marginTop: 0 }}>JOIN EXISTING PROJECT</h2>


                        {/* Join using project ID only, not name (resource tab shows both for ones you have access too */}
                        <p>Enter Project ID to join</p>
                        <input
                            type="text"
                            value={joinProjectName}
                            onChange={(e) => setJoinProjectName(e.target.value)}
                            placeholder="e.g. P101"
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginBottom: "15px"
                            }}
                        />

                        <button
                            onClick={handleJoinProject}
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
                            JOIN PROJECT
                        </button>
                    </div>
                </div>

            ) : (
                /* Active Project Selector
           Allows user to choose which project
           hardware will be checked in/out for */
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        <div style={{ border: "1px solid #000", padding: "20px", backgroundColor: "#f7f7f7", flex: 1 }}>
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
                                {userProjects.map((project) => (
                                    <option key={project.projectID} value={project.projectID}>
                                        {project.projectID} ({project.name})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* NEW: Hardware Set Selector Dropdown */}
                        {hardwareSets.length > 0 && (
                            <div style={{ border: "1px solid #000", padding: "20px", backgroundColor: "#f7f7f7", flex: 1 }}>
                                <label style={{ fontWeight: "700", marginRight: "10px" }}>Hardware Set:</label>
                                <select
                                    value={selectedHardwareIndex}
                                    onChange={(e) => setSelectedHardwareIndex(Number(e.target.value))}
                                    style={{
                                        padding: "10px",
                                        minWidth: "220px",
                                        border: "1px solid #ccc",
                                        borderRadius: "6px",
                                        fontSize: "16px",
                                        backgroundColor: "white",
                                    }}
                                >
                                    {hardwareSets.map((set, index) => (
                                        <option key={set.name} value={index}>
                                            {set.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    {resourceMessage && (
                        <div style={{ border: "1px solid #ddd", padding: "18px", backgroundColor: "#fafafa" }}>
                            {resourceMessage}
                        </div>
                    )}

                    {/* NEW: Display only the selected hardware set */}
                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                        {hardwareSets.length > 0 && hardwareSets[selectedHardwareIndex] && (
                            <div
                                key={hardwareSets[selectedHardwareIndex].name}
                                style={{
                                    border: "1px solid #ddd",
                                    padding: "24px",
                                    width: "570px",
                                    backgroundColor: "white",
                                }}
                            >
                                <h2 style={{ marginTop: 0, marginBottom: "18px", fontWeight: "500" }}>
                                    {hardwareSets[selectedHardwareIndex].name}
                                </h2>

                                <div
                                    style={{
                                        border: "1px solid #ddd",
                                        padding: "18px",
                                        marginBottom: "18px",
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    <p style={{ margin: "6px 0" }}><strong>Capacity:</strong> {hardwareSets[selectedHardwareIndex].capacity} units</p>
                                    <p style={{ margin: "6px 0" }}><strong>Available:</strong> {hardwareSets[selectedHardwareIndex].available} units</p>

                                    <p style={{ marginTop: "18px", marginBottom: "6px" }}>
                                        <strong>Your Project:</strong> {hardwareSets[selectedHardwareIndex].yourProject} units
                                    </p>
                                </div>

                                <div style={{ marginBottom: "18px" }}>
                                    <p style={{ marginBottom: "8px" }}>Check Out Units</p>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            value={hardwareSets[selectedHardwareIndex].checkoutQty}
                                            onChange={(e) =>
                                                handleResourceInputChange(selectedHardwareIndex, "checkoutQty", e.target.value)
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
                                            onClick={() => handleCheckout(selectedHardwareIndex)}
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
                                            value={hardwareSets[selectedHardwareIndex].checkinQty}
                                            onChange={(e) =>
                                                handleResourceInputChange(selectedHardwareIndex, "checkinQty", e.target.value)
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
                                            onClick={() => handleCheckin(selectedHardwareIndex)}
                                            disabled={hardwareSets[selectedHardwareIndex].yourProject === 0}
                                            style={{
                                                backgroundColor: "#0000ff",
                                                color: "WHITE",
                                                padding: "12px 20px",
                                                borderRadius: "10px",
                                                border: "none",
                                                fontWeight: "700",
                                                cursor: hardwareSets[selectedHardwareIndex].yourProject === 0 ? "not-allowed" : "pointer",
                                            }}
                                        >
                                            CHECK IN
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}