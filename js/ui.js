// ==============================
// ui.js
// Handles UI interactions
// ==============================

import { runSimulation } from "./simulation.js";
import { updateTimeChart, updateFrequencyChart } from "./chartConfig.js";

// ------------------------------
// DOM ELEMENTS
// ------------------------------
const resistanceSlider = document.getElementById("resistanceSlider");
const capacitanceSlider = document.getElementById("capacitanceSlider");
const inductanceSlider = document.getElementById("inductanceSlider");
const voltageSlider = document.getElementById("voltageSlider");

const resistanceValue = document.getElementById("resistanceValue");
const capacitanceValue = document.getElementById("capacitanceValue");
const inductanceValue = document.getElementById("inductanceValue");
const voltageValue = document.getElementById("voltageValue");

const rcButton = document.getElementById("rcButton");
const rlButton = document.getElementById("rlButton");

const chargeButton = document.getElementById("chargeButton");
const dischargeButton = document.getElementById("dischargeButton");

const capacitanceControl = document.getElementById("capacitanceControl");
const inductanceControl = document.getElementById("inductanceControl");

const timeConstantDisplay = document.getElementById("timeConstantDisplay");

const lowPassButton = document.getElementById("lowPassButton");
const highPassButton = document.getElementById("highPassButton");
const bandPassButton = document.getElementById("bandPassButton");
const notchButton = document.getElementById("notchButton");

// ------------------------------
// STATE
// ------------------------------
let state = {
    type: "RC",           // RC or RL
    mode: "charging",     // charging or discharging
    filter: "lowpass",
    R: 1000,
    C: 0.001,
    L: 0.01,
    V0: 5
};

// ------------------------------
// LOAD CIRCUIT SVG
// ------------------------------
function loadCircuitDiagram() {
    const container = document.getElementById("circuitContainer");

    // Map state → filename
    let fileName = "";

    if (state.type === "RC") {
        if (state.filter === "lowpass") {
            fileName = "RC_LowPassFilter.svg";
        } else if (state.filter === "highpass") {
            fileName = "RC_HighPassFilter.svg";
        }
    }

    if (state.type === "RL") {
        if (state.filter === "lowpass") {
            fileName = "RL_LowPassFilter.svg"; // change later to "RL_LowPassFilter.svg"
        } else if (state.filter === "highpass") {
            fileName = "RL_HighPassFilter.svg"; // change later to "RL_LowPassFilter.svg"
        }
    }

    if (state.type === "RLC") {
        if (state.filter === "bandpass") {
            fileName = "RLC_BandPassFilter.svg"; // change later to "RLC_BandPassFilter.svg"

        } else if (state.filter === "notch") {
            fileName = "RLC_NotchFilter.svg";   // change later to "RLC_NotchFilter.svg"
        }
    }

    // Load SVG
    if (fileName !== "") {
        container.innerHTML = `<img src="assets/icons/${fileName}" alt="Circuit Diagram">`;
    } else {
        container.innerHTML = "<p>No diagram available</p>";
    }
}

// ------------------------------
// UPDATE DISPLAY VALUES
// ------------------------------
function updateDisplayValues() {
    resistanceValue.textContent = state.R;
    capacitanceValue.textContent = state.C;
    inductanceValue.textContent = state.L;
    voltageValue.textContent = state.V0;
}

// ------------------------------
// UPDATE SIMULATION
// ------------------------------
function updateSimulation() {
    const result = runSimulation(state);

    // Time domain
    updateTimeChart(result.time, result.voltage);

    // Frequency domain (Bode magnitude)
    updateFrequencyChart(result.frequency, result.gain);
    
    timeConstantDisplay.textContent =
        `Time constant τ: ${result.tau.toExponential(3)} s`;
}

// ------------------------------
// HANDLE SLIDERS
// ------------------------------
function setupSliders() {
    resistanceSlider.addEventListener("input", () => {
        state.R = parseFloat(resistanceSlider.value);
        updateDisplayValues();
        updateSimulation();
    });

    capacitanceSlider.addEventListener("input", () => {
        state.C = parseFloat(capacitanceSlider.value);
        updateDisplayValues();
        updateSimulation();
    });

    inductanceSlider.addEventListener("input", () => {
        state.L = parseFloat(inductanceSlider.value);
        updateDisplayValues();
        updateSimulation();
    });

    voltageSlider.addEventListener("input", () => {
        state.V0 = parseFloat(voltageSlider.value);
        updateDisplayValues();
        updateSimulation();
    });
}

// ------------------------------
// HANDLE CIRCUIT TYPE TOGGLE
// ------------------------------
function setupCircuitToggle() {
    rcButton.addEventListener("click", () => {
        state.type = "RC";

        rcButton.classList.add("active");
        rlButton.classList.remove("active");

        capacitanceControl.classList.remove("hidden");
        inductanceControl.classList.add("hidden");

        updateSimulation();
    });

    rlButton.addEventListener("click", () => {
        state.type = "RL";

        rlButton.classList.add("active");
        rcButton.classList.remove("active");

        inductanceControl.classList.remove("hidden");
        capacitanceControl.classList.add("hidden");

        updateSimulation();
    });
}

// ------------------------------
// HANDLE MODE TOGGLE
// ------------------------------
function setupModeToggle() {
    chargeButton.addEventListener("click", () => {
        state.mode = "charging";

        chargeButton.classList.add("active");
        dischargeButton.classList.remove("active");

        updateSimulation();
    });

    dischargeButton.addEventListener("click", () => {
        state.mode = "discharging";

        dischargeButton.classList.add("active");
        chargeButton.classList.remove("active");

        updateSimulation();
    });
}

// ------------------------------
// HANDLE FILTER TOGGLE
// ------------------------------
function setupFilterToggle() {

    function resetButtons() {
        lowPassButton.classList.remove("active");
        highPassButton.classList.remove("active");
        bandPassButton.classList.remove("active");
        notchButton.classList.remove("active");
    }

    lowPassButton.addEventListener("click", () => {
        resetButtons();
        lowPassButton.classList.add("active");

        state.filter = "lowpass";
        loadCircuitDiagram();
        updateSimulation();
    });

    highPassButton.addEventListener("click", () => {
        resetButtons();
        highPassButton.classList.add("active");

        state.filter = "highpass";
        loadCircuitDiagram();
        updateSimulation();
    });

    bandPassButton.addEventListener("click", () => {
        resetButtons();
        bandPassButton.classList.add("active");

        state.filter = "bandpass";
        loadCircuitDiagram();
        updateSimulation();
    });

    notchButton.addEventListener("click", () => {
        resetButtons();
        notchButton.classList.add("active");

        state.filter = "notch";
        loadCircuitDiagram();
        updateSimulation();
    });
}

// ------------------------------
// INIT UI
// ------------------------------
export function initUI() {
    setupSliders();
    setupCircuitToggle();
    setupModeToggle();
    setupFilterToggle();

    updateDisplayValues();
    updateSimulation();
    loadCircuitDiagram();
}