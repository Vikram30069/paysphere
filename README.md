# PaySphere — Intelligent Secure Payments

> **TechTycoons Code-Revive Edition**  
> An intelligent payment simulation platform combining transaction processing, explainable risk detection, and automated Twilio SMS & Voice alerts with a premium fintech 3D interface.

---

## 🌟 Key Features

* **3D Holographic Balance Card**: Interactive mouse/touch 3D perspective tilt, holographic glowing pedestal, balance eye-mask toggle, monthly growth indicator, quick actions, and sparkline statistics.
* **⚠️ Unusual Transaction Detection Alert Card**: Pulsing siren beacon, incident details (`₹45,000.00`, `TXN7892910291`, `High Risk`), and a 5-step action pipeline.
* **Autonomous Security Response Workflow**: 5-step visual incident pipeline:
  1. `Transaction Detected`: High-value transfer anomaly flagged.
  2. `Risk Analysis`: Circular SVG Risk Gauge (92/100, High Risk) with explainable risk factors.
  3. `Twilio SMS Alert`: Mobile phone mockup rendering verified SMS alerts.
  4. `Twilio Voice Call`: Incoming call mockup with real-time audio waveform animations.
  5. `User Notified`: Verification checklist with direct account security actions.
* **Flagged Transaction Details Drawer**: Multi-tab drawer (`Details`, `Activity`, `Alerts`, `Timeline`), with Copy ID, Download Receipt, and Report/Block controls.
* **Explainable Rule-Based Risk Engine**: Evaluates transactions (0–100 score) across transfer volume, counterparty novelty, time-of-day, and velocity surges.
* **Twilio SMS & Voice Orchestration**: Clean provider abstraction supporting live Twilio credentials and a sandbox simulation mode.
* **Full Financial Invariant Enforced**: Strict balance ledger guarantees (`Ending Balance = Starting Balance - Successful Debits + Successful Credits`).
* **13 Bug Fixes Intact**: All 13 original defects remain resolved and verified across automated test suites.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Configuration (Optional for Live Twilio)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Twilio credentials if available:
```env
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PORT=3000
```
*(If credentials are not provided, PaySphere automatically operates in Sandbox Simulation Mode.)*

### 3. Run the Application
```bash
node server.js
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

* **Unit & Regression Tests (Phase 1 Fixes)**:
  ```bash
  node tests/test_logic.js
  ```
* **API & Service Integration Tests (Phase 2 Services)**:
  ```bash
  node tests/test_api.js
  ```
