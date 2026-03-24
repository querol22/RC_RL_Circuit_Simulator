// ==============================
// simulation.js
// Core physics + data generation
// ==============================

// ------------------------------
// Time Constant Calculation
// ------------------------------
export function calculateTimeConstant(type, R, C, L) {
    if (type === "RC") {
        return R * C;       // τ = RC
    } else if (type === "RL") {
        return L / R;       // τ = L / R
    }
    return 0;
}

// ------------------------------
// Generate Time Array
// ------------------------------
export function generateTimeArray(tau, points = 150) {
    const tMax = 5 * tau;  // simulate up to 5τ
    const dt = tMax / points;

    const time = [];
    for (let i = 0; i <= points; i++) {
        time.push(i * dt);
    }

    return time;
}

// ------------------------------
// Voltage Calculation
// ------------------------------
export function calculateVoltage(type, mode, t, V0, R, C, L) {
    const tau = calculateTimeConstant(type, R, C, L);
    // prevent tau = 0 → broken time array
    if (tau === 0) tau = 1e-6;

    if (type === "RC") {
        if (mode === "charging") {
            return V0 * (1 - Math.exp(-t / tau));
        } else {
            return V0 * Math.exp(-t / tau);
        }
    }

    if (type === "RL") {
        if (mode === "charging") {
            // Voltage across resistor in RL step response
            return V0 * (1 - Math.exp(-t / tau));
        } else {
            return V0 * Math.exp(-t / tau);
        }
    }

    if (type === "RLC") {
        return 0; // keep simple for demo (no time-domain RLC)
    }

    return 0;
}

// ------------------------------
// Generate Voltage Array
// ------------------------------
export function generateVoltageArray(type, mode, timeArray, V0, R, C, L) {
    return timeArray.map(t => 
        calculateVoltage(type, mode, t, V0, R, C, L)
    );
}

// ------------------------------
// Main Simulation Function
// ------------------------------
export function runSimulation(params) {
    const {
        type,   // "RC" or "RL"
        mode,   // "charging" or "discharging"
        filter,
        R,
        C,
        L,
        V0
    } = params;

    const tau = calculateTimeConstant(type, R, C, L);

    const timeArray = generateTimeArray(tau);
    const voltageArray = generateVoltageArray(type, mode, timeArray, V0, R, C, L);

    const freqData = generateFrequencyResponse(type, filter, R, C, L);

    return {
        time: timeArray,
        voltage: voltageArray,
        tau: tau,
        frequency: freqData.freqArray,
        gain: freqData.gainArray
    };
}

// ------------------------------
// Generate Frequency Response
// ------------------------------
export function generateFrequencyResponse(type, filter, R, C, L) {

    const freqArray = [];
    const gainArray = [];

    // Frequency range: 1 Hz → 100 kHz (log scale)
    const points = 100;
    const fMin = 1;
    const fMax = 100000;

    for (let i = 0; i < points; i++) {
        const f = fMin * Math.pow(fMax / fMin, i / points);
        const w = 2 * Math.PI * f;

        let gain = 0;

        if (type === "RC") {
            if (filter === "lowpass") {
                gain = 1 / Math.sqrt(1 + Math.pow(w * R * C, 2));
            } else if (filter === "highpass") {
                gain = (w * R * C) / Math.sqrt(1 + Math.pow(w * R * C, 2));
            }
        }

        if (type === "RL") {
            if (filter === "lowpass") {
                gain = R / Math.sqrt(R * R + Math.pow(w * L, 2));
            } else if (filter === "highpass") {
                gain = (w * L) / Math.sqrt(R * R + Math.pow(w * L, 2));
            }
        }

        if (type === "RLC") {

            const w0 = 1 / Math.sqrt(L * C);
            const Q = (1 / R) * Math.sqrt(L / C);

            if (filter === "bandpass") {

                gain = (w / w0) / Math.sqrt(
                    Math.pow(1 - Math.pow(w / w0, 2), 2) +
                    Math.pow(w / (w0 * Q), 2)
                );

            } else if (filter === "notch") {

                gain = Math.abs(1 - Math.pow(w / w0, 2)) / Math.sqrt(
                    Math.pow(1 - Math.pow(w / w0, 2), 2) +
                    Math.pow(w / (w0 * Q), 2)
                );

            } else {
                gain = 0;
            }
        }

        freqArray.push(f);
        gainArray.push(gain);
    }

    return { freqArray, gainArray };
}