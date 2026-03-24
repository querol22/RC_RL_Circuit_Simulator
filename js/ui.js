// ==============================
// ui.js
// Handles UI interactions
// ==============================

import { runSimulation } from "./simulation.js";
import { updateTimeChart, updateFrequencyChart } from "./chartConfig.js";

// ------------------------------
// DOM ELEMENTS
// ------------------------------
const resistanceInput = document.getElementById("resistanceInput");
const capacitanceInput = document.getElementById("capacitanceInput");
const inductanceInput = document.getElementById("inductanceInput");
const voltageInput = document.getElementById("voltageInput");

const rcButton = document.getElementById("rcButton");
const rlButton = document.getElementById("rlButton");
const rlcButton = document.getElementById("rlcButton");

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
    type: "RC",           // RC or RL or RLC
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
            fileName = "RL_LowPassFilter.svg";
        } else if (state.filter === "highpass") {
            fileName = "RL_HighPassFilter.svg";
        }
    }

    if (state.type === "RLC") {
        if (state.filter === "bandpass") {
            fileName = "RLC_series_BandPassFilter.svg";

        } else if (state.filter === "notch") {
            fileName = "RLC_series_NotchFilter.svg";
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
/*function updateDisplayValues() {
    resistanceInput.textContent = state.R;
    capacitanceInput.textContent = state.C;
    inductanceInput.textContent = state.L;
    voltageInput.textContent = state.V0;
}*/

// ------------------------------
// UPDATE SIMULATION
// ------------------------------
function updateSimulation() {
    const result = runSimulation(state);

    // Time domain
    updateTimeChart(result.time, result.voltage);

    // Frequency domain (Bode magnitude)
    updateFrequencyChart(result.frequency, result.gain);
    
    // Info
    updateInfoPanel();
}

// ------------------------------
// HANDLE Inputs R, C, L, Vin
// ------------------------------
function setupInputs() {

    resistanceInput.addEventListener("input", () => {
        const val = parseFloat(resistanceInput.value);
        if (!isNaN(val)) state.R = val;
        updateSimulation();
    });

    capacitanceInput.addEventListener("input", () => {
        const val = parseFloat(capacitanceInput.value);
        if (!isNaN(val)) state.C = val;
        updateSimulation();
    });

    inductanceInput.addEventListener("input", () => {
        const val = parseFloat(inductanceInput.value);
        if (!isNaN(val)) state.L = val;
        updateSimulation();
    });

    voltageInput.addEventListener("input", () => {
        const val = parseFloat(voltageInput.value);
        if (!isNaN(val)) state.V0 = val;
        updateSimulation();
    });
}


// ------------------------------
// HANDLE Info Panel
// ------------------------------
function updateInfoPanel() {
    const info = document.querySelector(".formula");

    if (state.type === "RC") {
        const tau = state.R * state.C;

        timeConstantDisplay.textContent =
            `τ = ${tau.toExponential(2)} s`;

        info.innerHTML =
            state.mode === "charging"
            ? `V(t) = V₀ (1 - e<sup>-t/RC</sup>)`
            : `V(t) = V₀ e<sup>-t/RC</sup>`;
    }

    else if (state.type === "RL") {
        const tau = state.L / state.R;

        timeConstantDisplay.textContent =
            `τ = ${tau.toExponential(2)} s`;

        info.innerHTML =
            state.mode === "charging"
            ? `V(t) = V₀ (1 - e<sup>-tR/L</sup>)`
            : `V(t) = V₀ e<sup>-tR/L</sup>`;
    }

    else if (state.type === "RLC") {
        const w0 = 1 / Math.sqrt(state.L * state.C);
        const f0 = w0 / (2 * Math.PI);

        timeConstantDisplay.textContent =
            `f₀ = ${f0.toFixed(1)} Hz`;

        info.innerHTML =
            `Band-pass / Notch filter (RLC)`;
    }
}

// ------------------------------
// HANDLE CIRCUIT TYPE TOGGLE
// ------------------------------
function setupCircuitToggle() {
    rcButton.addEventListener("click", () => {
        state.type = "RC";

        rcButton.classList.add("active");
        rlButton.classList.remove("active");
        rlcButton.classList.remove("active");

        capacitanceControl.classList.remove("hidden");
        inductanceControl.classList.add("hidden");

        updateSimulation();
    });

    rlButton.addEventListener("click", () => {
        state.type = "RL";

        rlButton.classList.add("active");
        rcButton.classList.remove("active");
        rlcButton.classList.remove("active");

        inductanceControl.classList.remove("hidden");
        capacitanceControl.classList.add("hidden");

        updateSimulation();
    });

    rlcButton.addEventListener("click", () => {
        state.type = "RLC";

        rlcButton.classList.add("active");
        rlButton.classList.remove("active");
        rcButton.classList.remove("active");

        inductanceControl.classList.remove("hidden");
        capacitanceControl.classList.remove("hidden");

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
    setupInputs();
    setupCircuitToggle();
    setupModeToggle();
    setupFilterToggle();

    updateSimulation();
    loadCircuitDiagram();
    
    // Some crushes--> Initialise RC circuit + LowPassFilter
    rcButton.classList.add("active");
    lowPassButton.classList.add("active");
}