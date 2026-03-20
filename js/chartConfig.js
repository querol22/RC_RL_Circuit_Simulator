let timeChart = null;
let frequencyChart = null;

export function initChart() {
    const timeCtx = document.getElementById("timeChart").getContext("2d");
    const freqCtx = document.getElementById("frequencyChart").getContext("2d");

    // Time Chart
    timeChart = new Chart(timeCtx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Voltage vs Time",
                data: [],
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            animation: false,
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time (s)" }},
                y: { title: { display: true, text: "Voltage (V)" }}
            }
        }
    });

    // Frequency Chart
    frequencyChart = new Chart(freqCtx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: "Frequency Response",
                data: [],
                pointRadius: 0,
                borderWidth: 2
            }]
        },
        options: {
            animation: false,
            responsive: true,
            scales: {
                x: {type: 'logarithmic', title: { display: true, text: "Frequency (Hz)" }},
                y: {title: { display: true, text: "Gain" }}
            }
        }
    });
}

export function updateTimeChart(timeArray, voltageArray) {
    timeChart.data.labels = timeArray;
    timeChart.data.datasets[0].data = voltageArray;
    timeChart.update();
}

export function updateFrequencyChart(freqArray, gainArray) {
    frequencyChart.data.labels = freqArray;
    frequencyChart.data.datasets[0].data = gainArray;
    frequencyChart.update();
}