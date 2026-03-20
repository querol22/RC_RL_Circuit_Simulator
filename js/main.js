// ==============================
// main.js
// Entry point of the application
// ==============================

import { initChart } from "./chartConfig.js";
import { initUI } from "./ui.js";

// ------------------------------
// Initialize App
// ------------------------------
function initApp() {
    // Initialize Chart
    initChart();

    // Initialize UI + Simulation
    initUI();
}

// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);