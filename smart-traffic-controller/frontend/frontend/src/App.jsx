import { useState } from "react";
import "./App.css";

function App() {
  const [vehicles, setVehicles] = useState("");
  const [greenTime, setGreenTime] = useState(0);
  const [activeLight, setActiveLight] = useState("red");
  const [timer, setTimer] = useState(0);
  const [simulationDone, setSimulationDone] = useState(false);

  const sendData = async () => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const res = await fetch(`${API_URL}/calculate-time`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicles }),
    });

    const data = await res.json();
    setGreenTime(data.greenTime);
    startSignal(data.greenTime);
  };

  const startSignal = (time) => {
    setSimulationDone(false);
    setActiveLight("green");
    setTimer(time);

    let t = time;
    const interval = setInterval(() => {
      t--;
      setTimer(t);

      if (t <= 0) {
        clearInterval(interval);
        setActiveLight("yellow");

        setTimeout(() => {
          setActiveLight("red");
          setSimulationDone(true);
        }, 3000);
      }
    }, 1000);
  };

  return (
    <div className="container">
      <h1>🚦 Smart Traffic Control System</h1>

      <input
        type="number"
        placeholder="Enter vehicle count"
        value={vehicles}
        onChange={(e) => setVehicles(e.target.value)}
      />

      <button onClick={sendData}>Start Simulation</button>

      <div className="traffic-light">
        <div className={`light red ${activeLight === "red" ? "active" : ""}`} />
        <div className={`light yellow ${activeLight === "yellow" ? "active" : ""}`} />
        <div className={`light green ${activeLight === "green" ? "active" : ""}`} />
      </div>

      {activeLight === "green" && <p>Green Time: {timer}s</p>}

      {simulationDone && (
        <div className="simulation-done-box">
          <p>SIMULATION DONE</p>
        </div>
      )}
    </div>
  );
}

export default App;
