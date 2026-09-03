/**
 * PaySphere — Explainable Rule-Based Risk Engine
 * Analyzes transactions in real-time, calculates risk scores (0-100),
 * determines risk tier, and produces transparent, human-readable risk factors.
 */

const RISK_LEVELS = Object.freeze({
    LOW      : 'LOW',
    MEDIUM   : 'MEDIUM',
    HIGH     : 'HIGH',
    CRITICAL : 'CRITICAL'
});

// Known trusted contacts for anomaly evaluation
const KNOWN_BENEFICIARIES = new Set([
    'rahul@payflow',
    'priya@upi',
    '9876543210@ybl',
    'meera.patel@okaxis',
    'ananya@paytm',
    'deepak@phonepe',
    'swiggy@upi',
    'amazon@apl'
]);

class RiskService {
    constructor() {
        this.historicalAverage = 2800.00;
        this.transactionVelocity = new Map(); // recipient -> timestamp array
    }

    /**
     * Evaluates a payment transaction and returns an explainable risk assessment
     */
    evaluateTransaction({ amount, recipient, note = '', timestamp = new Date() }) {
        const parsedAmount = parseFloat(amount) || 0;
        const recipientLower = (recipient || '').toLowerCase().trim();
        const date = new Date(timestamp);
        const hour = date.getHours();

        let score = 5; // Baseline minimum score
        const factors = [];

        // Factor 1: Amount Anomaly Detection
        if (parsedAmount > 40000) {
            score += 45;
            factors.push(`Critical amount anomaly: Amount (₹${parsedAmount.toLocaleString('en-IN')}) exceeds standard ceiling (>₹40,000)`);
        } else if (parsedAmount > 20000) {
            score += 30;
            factors.push(`Significant amount anomaly: Amount (₹${parsedAmount.toLocaleString('en-IN')}) is 7x higher than historical average (₹${this.historicalAverage})`);
        } else if (parsedAmount > 8000) {
            score += 15;
            factors.push(`Elevated transaction volume: Amount is above typical daily transfer size`);
        }

        // Factor 2: Beneficiary Recognition
        const isKnown = KNOWN_BENEFICIARIES.has(recipientLower) || recipientLower.includes('payflow');
        if (!isKnown) {
            score += 25;
            factors.push(`Unrecognized recipient: First-time transfer to new destination "${recipient}"`);
        }

        // Factor 3: Time-of-Day Anomaly (Late night / Early morning: 11 PM - 5 AM)
        if (hour >= 23 || hour < 5) {
            score += 15;
            factors.push(`Temporal risk flag: Transaction initiated during non-standard hours (${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`);
        }

        // Factor 4: Note / Keyword Risk Heuristics
        const noteLower = (note || '').toLowerCase();
        if (noteLower.includes('urgent') || noteLower.includes('crypto') || noteLower.includes('gift card') || noteLower.includes('lottery') || noteLower.includes('overseas')) {
            score += 20;
            factors.push(`Suspicious memo content: Note contains high-risk payment keywords`);
        }

        // Factor 5: Velocity & Frequency Monitoring
        const recentTransfers = this.transactionVelocity.get(recipientLower) || [];
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const rapidTransfers = recentTransfers.filter(t => t > oneHourAgo);

        if (rapidTransfers.length >= 2) {
            score += 20;
            factors.push(`High velocity pattern: Multiple repeated transfers to recipient within the last hour (${rapidTransfers.length + 1} transfers)`);
        }

        // Cap score at 100 max, 0 min
        score = Math.min(100, Math.max(0, score));

        // Determine Level
        let level = RISK_LEVELS.LOW;
        if (score >= 80) {
            level = RISK_LEVELS.CRITICAL;
        } else if (score >= 60) {
            level = RISK_LEVELS.HIGH;
        } else if (score >= 30) {
            level = RISK_LEVELS.MEDIUM;
        }

        const isFlagged = score >= 60;

        // Record velocity
        recentTransfers.push(Date.now());
        this.transactionVelocity.set(recipientLower, recentTransfers);

        return {
            score,
            level,
            isFlagged,
            factors: factors.length > 0 ? factors : ['Standard routine payment within expected behavioral thresholds'],
            evaluatedAt: date.toISOString(),
            recommendation: isFlagged
                ? 'Automated security alert triggered: Recommend SMS confirmation and voice verification.'
                : 'Transaction cleared: Risk level nominal.'
        };
    }
}

module.exports = {
    riskService: new RiskService(),
    RISK_LEVELS
};
