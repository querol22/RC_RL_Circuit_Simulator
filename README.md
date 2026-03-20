# RC / RL / RLC Circuit Simulator

Interactive web-based simulator for analyzing **time-domain and frequency-domain behavior** of electrical circuits (RC, RL, and RLC).

This project demonstrates fundamental concepts in **signal processing and filtering**, with direct applications in **biomedical engineering** (e.g., ECG noise filtering).

---

## 🚀 Features

### 🔧 Circuit Types

* RC Circuits
* RL Circuits
* RLC Circuits (Band-pass)

### 🎛️ Filter Modes

* Low-pass
* High-pass
* Band-pass
* Notch (planned)

### 📊 Visualizations

* **Voltage vs Time** (charging / discharging curves)
* **Frequency Response (Bode Plot)** (logarithmic scale)

### ⚡ Interactivity

* Adjustable parameters:

  * Resistance (R)
  * Capacitance (C)
  * Inductance (L)
  * Input Voltage (V₀)
* Real-time updates using sliders
* Dynamic circuit diagram rendering (.svg)

---

## 🧠 Engineering Concepts Covered

* First-order systems (RC, RL)
* Second-order systems (RLC)
* Time constants (τ = RC, τ = L/R)
* Exponential responses
* Frequency response and filtering
* Logarithmic scaling (Bode plots)

---

## 🏥 Biomedical Relevance

This simulator reflects real-world applications such as:

* Low-pass filtering for ECG noise reduction
* High-pass filtering for baseline drift removal
* Notch filtering for power-line interference (50/60 Hz)

---

## 📁 Project Structure

```
rc-rl-simulator/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   ├── main.js
│   ├── ui.js
│   ├── simulation.js
│   └── chartConfig.js
│
├── assets/
│   └── *.svg (circuit diagrams)
```

---

## 🛠️ Technologies Used

* HTML5 / CSS3
* JavaScript (ES6 Modules)
* Chart.js

---

## 🧪 How to Run

1. Clone the repository:

```
git clone https://github.com/YOUR_USERNAME/rc-rl-simulator.git
```

2. Open `index.html` in your browser

*(No build tools required)*

---

## 🔜 Upcoming Improvements

* [ ] Reduce graph size and improve layout responsiveness
* [ ] Highlight active selections (e.g., RC + Low-pass in green)
* [ ] Add complete set of circuit diagrams (.svg)
* [ ] Allow manual input fields alongside sliders
* [ ] Improve RLC model accuracy (full transfer functions)
* [ ] Add cutoff frequency visualization (−3 dB point)
* [ ] Add phase response to Bode plot

---

## 💡 Future Extensions

* ECG signal simulation + noise filtering
* Export plots as PNG
* Interactive component highlighting (current flow animation)
* Parameter presets (biomedical scenarios)

---

## 👨‍💻 Author

David Querol
M.Sc. Biomedical Engineering (RWTH Aachen)

---

## 📜 License

This project is open-source and available under the MIT License.
