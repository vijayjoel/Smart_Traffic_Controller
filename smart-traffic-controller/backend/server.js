import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Store active simulation state
let activeSimulation = {
    id: null,
    timeout: null,
    startTime: null
};

app.post("/calculate-time", (req, res) => {
    const { vehicles } = req.body;
    let greenTime;

    if (vehicles <= 5) greenTime = 10;
    else if (vehicles <= 15) greenTime = 20;
    else if (vehicles <= 30) greenTime = 30;
    else greenTime = 40;

    // Stop previous simulation if active
    if (activeSimulation.timeout) {
        clearTimeout(activeSimulation.timeout);
        console.log(`Stopped previous simulation (ID: ${activeSimulation.id})`);
    }

    // Create new simulation
    const simulationId = Date.now();
    activeSimulation.id = simulationId;
    activeSimulation.startTime = new Date();

    console.log(`Started new simulation (ID: ${simulationId}) with ${vehicles} vehicles, green time: ${greenTime}s`);

    // Set timeout for simulation duration
    activeSimulation.timeout = setTimeout(() => {
        if (activeSimulation.id === simulationId) {
            activeSimulation.id = null;
            activeSimulation.timeout = null;
            console.log(`Simulation (ID: ${simulationId}) completed`);
        }
    }, greenTime * 1000);

    res.json({ 
        greenTime,
        simulationId,
        message: "New simulation started, previous simulation stopped if active"
    });
});

app.get("/simulation-status", (req, res) => {
    res.json({
        isActive: activeSimulation.id !== null,
        simulationId: activeSimulation.id,
        startTime: activeSimulation.startTime
    });
});

app.post("/stop-simulation", (req, res) => {
    if (activeSimulation.timeout) {
        clearTimeout(activeSimulation.timeout);
        const stoppedId = activeSimulation.id;
        activeSimulation.id = null;
        activeSimulation.timeout = null;
        activeSimulation.startTime = null;
        
        res.json({ 
            message: `Simulation (ID: ${stoppedId}) stopped successfully`
        });
    } else {
        res.json({ 
            message: "No active simulation to stop"
        });
    }
});

app.listen(3000, () => {
    console.log("Backend running at http://localhost:3000");
});
