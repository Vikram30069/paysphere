<div align="center">

# PaySphere: Intelligent Payment Simulation & Incident Dispatch

### Rule-Based Anomaly Evaluation, Multi-Channel Twilio Alerts & Interactive Incident Console

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Twilio](https://img.shields.io/badge/Twilio-SMS%20%7C%20Voice-F22F46?style=flat-square&logo=twilio&logoColor=white)](https://www.twilio.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

> **Real-Time Financial Incident Orchestration**: An interactive fintech transaction simulation platform that evaluates payment transfers with an explainable risk engine and autonomously dispatches real-time Twilio SMS and synthesized Voice alerts during high-risk transfer anomalies.

</div>

---

## 1. System Architecture & Incident Workflow

PaySphere models an end-to-end incident response pipeline triggered by transaction anomalies:

```mermaid
graph TD
    TXN[Incoming Transaction / Transfer Simulation] --> ENGINE[Rule-Based Risk Engine]
    
    subgraph Multi-Signal Risk Assessment
        ENGINE --> V1[Transfer Volume vs Baseline]
        ENGINE --> V2[Counterparty Novelty]
        ENGINE --> V3[Time-of-Day Window]
        ENGINE --> V4[Burst Velocity Anomaly]
    end

    V1 & V2 & V3 & V4 --> SCORE[Composite Risk Score: 0 - 100]

    SCORE -->|Score >= 75 - HIGH RISK| DISPATCH[Autonomous Incident Dispatcher]
    SCORE -->|Score < 75 - NORMAL| CLEAR[Process & Ledger Update]

    subgraph Emergency Alert Dispatch
        DISPATCH --> SMS[Twilio SMS Gateway: Verification Code]
        DISPATCH --> VOICE[Twilio Programmable Voice: IVR Callback]
        DISPATCH --> UI[Incident Drawer & Holographic Siren Alert]
    end
```

---

## 2. Core Features

- **Rule-Based Risk Scoring**: Quantifies transaction risk (0–100) using a multi-factor heuristic engine evaluating transfer amount, beneficiary novelty, unusual transaction hours, and transfer velocity.
- **Automated Multi-Channel Telephony**: Dispatches urgent SMS notifications and initiates automated synthetic voice phone calls via Twilio when transactions trigger high-risk thresholds.
- **Interactive Security UI/UX**:
  - **3D Holographic Perspective Tilt**: Dynamic mouse-tracking CSS 3D balance card with monthly trend sparklines.
  - **Circular SVG Risk Gauge**: Visual risk breakdown displaying specific contributing factors (e.g. `+35 New Beneficiary`, `+30 Amount Surge`).
  - **Forensic Drawer**: Expandable incident drawer with transaction ID hashing, receipt export, and account lock controls.
- **Modular Backend Services**: Strict separation between `paymentService.js`, `riskService.js`, and `notificationService.js`.

---

## 3. Technology Stack

- **Backend Runtime**: Node.js (v18+), Express.js
- **Telephony & Emergency Alerts**: Twilio Node SDK (Programmable SMS & Voice)
- **Frontend Layer**: HTML5, Vanilla JavaScript, CSS3 3D Canvas
- **Testing**: Node.js test runners (`tests/test_api.js`, `tests/test_logic.js`)

---

## 4. Project Structure

```
paysphere/
├── providers/                  # External service clients (Twilio wrapper)
├── services/                   # Business logic layer
│   ├── notificationService.js  # SMS and Voice dispatch logic
│   ├── paymentService.js       # Transaction simulation & history
│   └── riskService.js          # Heuristic scoring engine
├── tests/                      # Automated test scripts
│   ├── test_api.js
│   └── test_logic.js
├── index.html                  # Main interactive dashboard
├── login.html                  # Authentication demo view
├── script.js                   # Client-side state & UI controllers
├── style.css                   # Custom 3D UI & theme styling
├── server.js                   # Express application entrypoint
├── package.json
└── README.md
```

---

## 5. Quickstart & Installation

### Prerequisites
- Node.js v18 or higher
- Twilio Account credentials (optional for testing; mock fallback included)

### Setup Instructions

1. **Clone repository:**
   ```bash
   git clone https://github.com/Vikram30069/paysphere.git
   cd paysphere
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Run test suite:**
   ```bash
   npm test
   ```

5. **Start server:**
   ```bash
   npm start
   ```
   Open `http://localhost:3000` in your browser.

---

## 6. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
