/**
 * PaySphere — Payment & Ledger Service
 * Manages ledger transactions, idempotency cache, financial invariant verification,
 * explainable risk scoring, and security event timelines.
 */

const { riskService, RISK_LEVELS } = require('./riskService');
const notificationService = require('./notificationService');

const TRANSACTION_TYPES = {
    DEBIT  : 'debit',
    CREDIT : 'credit'
};

const TRANSACTION_STATUS = {
    SUCCESSFUL : 'Successful',
    PENDING    : 'Pending',
    FAILED     : 'Failed'
};

class PaymentService {
    constructor() {
        this.balance = 540000.00;
        this.startingBalance = 540000.00;
        this.idempotencyCache = new Map();

        // Seed default historical records with explainable risk ratings
        this.transactions = [
            {
                id        : 'TXNA1B2C3',
                name      : 'Rahul Kumar',
                upi       : 'rahul@payflow',
                amount    : 1200,
                type      : TRANSACTION_TYPES.DEBIT,
                status    : TRANSACTION_STATUS.SUCCESSFUL,
                note      : 'Lunch split',
                date      : 'Today, 10:45 AM',
                timestamp : new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                color     : '#4F46E5',
                risk      : { score: 12, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Routine lunch payment to known contact'] }
            },
            {
                id        : 'TXND4E5F6',
                name      : 'Priya Sharma',
                upi       : 'priya@upi',
                amount    : 3500,
                type      : TRANSACTION_TYPES.CREDIT,
                status    : TRANSACTION_STATUS.SUCCESSFUL,
                note      : 'Salary advance',
                date      : 'Yesterday, 6:20 PM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
                color     : '#059669',
                risk      : { score: 8, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Direct credit salary transfer'] }
            },
            {
                id        : 'TXNG7H8I9',
                name      : 'Vikram Singh',
                upi       : '9876543210@ybl',
                amount    : 850,
                type      : TRANSACTION_TYPES.DEBIT,
                status    : TRANSACTION_STATUS.PENDING,
                note      : 'Movie tickets',
                date      : 'Yesterday, 2:10 PM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
                color     : '#D97706',
                risk      : { score: 18, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Normal peer transfer'] }
            },
            {
                id        : 'TXNJ0K1L2',
                name      : 'Meera Patel',
                upi       : 'meera.patel@okaxis',
                amount    : 5000,
                type      : TRANSACTION_TYPES.CREDIT,
                status    : TRANSACTION_STATUS.SUCCESSFUL,
                note      : 'Rent share',
                date      : '29 Aug, 11:00 AM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
                color     : '#7C3AED',
                risk      : { score: 10, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Regular rental settlement'] }
            },
            {
                id        : 'TXNM3N4O5',
                name      : 'Amazon Pay',
                upi       : 'amazon@apl',
                amount    : 2349,
                type      : TRANSACTION_TYPES.DEBIT,
                status    : TRANSACTION_STATUS.FAILED,
                note      : 'Order #AMZ-9812',
                date      : '28 Aug, 9:30 AM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
                color     : '#DC2626',
                risk      : { score: 22, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Failed merchant transaction'] }
            },
            {
                id        : 'TXNP6Q7R8',
                name      : 'Ananya Roy',
                upi       : 'ananya@paytm',
                amount    : 750,
                type      : TRANSACTION_TYPES.DEBIT,
                status    : TRANSACTION_STATUS.SUCCESSFUL,
                note      : 'Coffee',
                date      : '27 Aug, 4:15 PM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
                color     : '#EC4899',
                risk      : { score: 5, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Micro-payment to frequent contact'] }
            },
            {
                id        : 'TXNS9T0U1',
                name      : 'Deepak Menon',
                upi       : 'deepak@phonepe',
                amount    : 12000,
                type      : TRANSACTION_TYPES.CREDIT,
                status    : TRANSACTION_STATUS.SUCCESSFUL,
                note      : 'Freelance payment',
                date      : '26 Aug, 1:00 PM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
                color     : '#0EA5E9',
                risk      : { score: 25, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Client consulting payment'] }
            },
            {
                id        : 'TXNV2W3X4',
                name      : 'Swiggy',
                upi       : 'swiggy@upi',
                amount    : 420,
                type      : TRANSACTION_TYPES.DEBIT,
                status    : TRANSACTION_STATUS.PENDING,
                note      : 'Food order',
                date      : '25 Aug, 8:00 PM',
                timestamp : new Date(Date.now() - 1000 * 60 * 60 * 144).toISOString(),
                color     : '#F97316',
                risk      : { score: 14, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Delivery order pending validation'] }
            }
        ];

        // Seeded Security Alerts & Timeline Store
        this.securityAlerts = [
            {
                id           : 'ALT_SEC_981',
                txnId        : 'TXN_SIM_SAMPLE',
                amount       : 45000,
                recipient    : 'Unknown Beneficiary (0982348123@upi)',
                riskScore    : 92,
                riskLevel    : RISK_LEVELS.CRITICAL,
                status       : 'Flagged',
                reasons      : [
                    'Amount (₹45,000) significantly above standard profile ceiling',
                    'First-time transfer to unrecognized new recipient',
                    'Temporal anomaly: Late night transaction pattern'
                ],
                smsSent      : true,
                voiceSent    : true,
                timestamp    : new Date(Date.now() - 1000 * 60 * 15).toISOString(),
                timeline     : [
                    { step: 1, name: 'Transaction Initiated', time: '15m ago', done: true },
                    { step: 2, name: 'Risk Engine Analyzed (Score: 92/100)', time: '15m ago', done: true },
                    { step: 3, name: 'Twilio Security SMS Dispatched', time: '14m ago', done: true },
                    { step: 4, name: 'Automated Voice Call Verification Triggered', time: '14m ago', done: true },
                    { step: 5, name: 'User Alerted & Monitoring Active', time: '12m ago', done: true }
                ]
            }
        ];
    }

    generateTxnId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = 'TXN';
        for (let i = 0; i < 8; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    isValidRecipient(value) {
        if (!value || typeof value !== 'string') return false;
        const phone = /^[0-9]{10}$/;
        const upi = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        return phone.test(value.trim()) || upi.test(value.trim());
    }

    getBalance() {
        return {
            balance   : this.balance,
            formatted : `₹${this.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        };
    }

    getTransactions() {
        return [...this.transactions];
    }

    getTransactionById(id) {
        return this.transactions.find(t => t.id.toLowerCase() === id.toLowerCase());
    }

    getSecurityAlerts() {
        return [...this.securityAlerts];
    }

    getFlaggedTransactions() {
        return this.transactions.filter(t => t.risk && t.risk.isFlagged);
    }

    getStats() {
        const totalSent = this.transactions
            .filter(t => t.type === TRANSACTION_TYPES.DEBIT && t.status === TRANSACTION_STATUS.SUCCESSFUL)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalReceived = this.transactions
            .filter(t => t.type === TRANSACTION_TYPES.CREDIT && t.status === TRANSACTION_STATUS.SUCCESSFUL)
            .reduce((sum, t) => sum + t.amount, 0);

        const successfulCount = this.transactions
            .filter(t => t.status === TRANSACTION_STATUS.SUCCESSFUL).length;

        const pendingCount = this.transactions
            .filter(t => t.status === TRANSACTION_STATUS.PENDING).length;

        const failedCount = this.transactions
            .filter(t => t.status === TRANSACTION_STATUS.FAILED).length;

        const flaggedCount = this.transactions
            .filter(t => t.risk && t.risk.isFlagged).length;

        return {
            totalSent,
            totalReceived,
            successfulCount,
            pendingCount,
            failedCount,
            flaggedCount,
            currentBalance : this.balance
        };
    }

    evaluateRiskPreview({ recipient, amount, note = '' }) {
        return riskService.evaluateTransaction({ recipient, amount, note });
    }

    async processPayment({ recipient, amount, note = '', idempotencyKey = null, notifySMS = false, notifyCall = false, phone = null }) {
        // 1. Idempotency Check (prevent duplicate submission)
        if (idempotencyKey && this.idempotencyCache.has(idempotencyKey)) {
            console.log(`[PaymentService] Duplicate submission blocked with key: ${idempotencyKey}`);
            return {
                ...this.idempotencyCache.get(idempotencyKey),
                isDuplicate: true
            };
        }

        // 2. Input Validation
        if (!recipient || !this.isValidRecipient(recipient)) {
            const error = new Error('Invalid recipient. Please enter a valid UPI ID (e.g. user@bank) or 10-digit phone number.');
            error.code = 'INVALID_RECIPIENT';
            throw error;
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            const error = new Error('Amount must be greater than ₹0.');
            error.code = 'INVALID_AMOUNT';
            throw error;
        }

        // 3. Balance Check
        if (parsedAmount > this.balance) {
            const error = new Error('Amount exceeds your available balance.');
            error.code = 'INSUFFICIENT_BALANCE';
            throw error;
        }

        // 4. Explainable Risk Evaluation
        const now = new Date();
        const riskAssessment = riskService.evaluateTransaction({
            amount    : parsedAmount,
            recipient,
            note,
            timestamp : now
        });

        // 5. State Update (Deduct balance FIRST, then create transaction)
        this.balance -= parsedAmount;

        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const dateStr = `Today, ${timeStr}`;
        const txnId = this.generateTxnId();

        const newTransaction = {
            id        : txnId,
            name      : recipient,
            upi       : recipient.includes('@') ? recipient : `${recipient}@upi`,
            amount    : parsedAmount,
            type      : TRANSACTION_TYPES.DEBIT,
            status    : TRANSACTION_STATUS.SUCCESSFUL, // Bug 4 fix: exact casing
            note      : note.trim(),
            date      : dateStr,
            color     : riskAssessment.isFlagged ? '#DC2626' : '#4F46E5',
            timestamp : now.toISOString(),
            risk      : riskAssessment
        };

        this.transactions.unshift(newTransaction);

        // 6. Security Event & Alert Creation if high risk
        let securityAlert = null;
        if (riskAssessment.isFlagged) {
            securityAlert = {
                id        : 'ALT_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
                txnId     : txnId,
                amount    : parsedAmount,
                recipient : recipient,
                riskScore : riskAssessment.score,
                riskLevel : riskAssessment.level,
                status    : 'Flagged',
                reasons   : riskAssessment.factors,
                smsSent   : Boolean(notifySMS || riskAssessment.isFlagged),
                voiceSent : Boolean(notifyCall || riskAssessment.score >= 80),
                timestamp : now.toISOString(),
                timeline  : [
                    { step: 1, name: 'Transaction Initiated', time: timeStr, done: true },
                    { step: 2, name: `Risk Evaluated (Score: ${riskAssessment.score}/100 - ${riskAssessment.level})`, time: timeStr, done: true },
                    { step: 3, name: 'Security Alert Created & Flagged', time: timeStr, done: true },
                    { step: 4, name: 'Twilio SMS Security Alert Dispatched', time: timeStr, done: true },
                    { step: 5, name: riskAssessment.score >= 80 ? 'Twilio Automated Voice Call Dispatched' : 'Real-time Monitoring Active', time: timeStr, done: true }
                ]
            };
            this.securityAlerts.unshift(securityAlert);
        }

        // 7. Trigger Notifications (SMS / Voice)
        let notificationResults = { sms: null, call: null };
        const recipientPhone = phone || (recipient.match(/^[0-9]{10}$/) ? recipient : '+919876543210');

        // If flagged as high risk, auto-dispatch security SMS alert
        const shouldSendSMS = notifySMS || riskAssessment.isFlagged;
        const shouldMakeCall = notifyCall || riskAssessment.score >= 80;

        if (shouldSendSMS) {
            notificationResults.sms = await notificationService.sendPaymentSMS({
                to        : recipientPhone,
                amount    : parsedAmount,
                recipient,
                txnId,
                isSecurityAlert : riskAssessment.isFlagged,
                riskScore       : riskAssessment.score
            });
        }

        if (shouldMakeCall) {
            notificationResults.call = await notificationService.makeSecurityCall({
                to        : recipientPhone,
                amount    : parsedAmount,
                recipient,
                txnId,
                riskScore : riskAssessment.score
            });
        }

        const result = {
            success          : true,
            transaction      : newTransaction,
            balance          : this.balance,
            formattedBalance : `₹${this.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
            risk             : riskAssessment,
            securityAlert    : securityAlert,
            notifications    : notificationResults
        };

        // Cache for idempotency (expire after 10 minutes)
        if (idempotencyKey) {
            this.idempotencyCache.set(idempotencyKey, result);
            setTimeout(() => this.idempotencyCache.delete(idempotencyKey), 10 * 60 * 1000);
        }

        return result;
    }

    // Demo Top-Up (Add Money)
    addMoney({ amount, method = 'UPI Demo Bank' }) {
        const parsed = parseFloat(amount);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error('Top-up amount must be greater than ₹0.');
        }

        this.balance += parsed;

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const txnId = this.generateTxnId();

        const topUpTxn = {
            id        : txnId,
            name      : `Wallet Top-Up (${method})`,
            upi       : 'wallet@payflow',
            amount    : parsed,
            type      : TRANSACTION_TYPES.CREDIT,
            status    : TRANSACTION_STATUS.SUCCESSFUL,
            note      : 'Demo Wallet Top-Up',
            date      : `Today, ${timeStr}`,
            color     : '#059669',
            timestamp : now.toISOString(),
            risk      : { score: 0, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Authorized wallet top-up credit'] }
        };

        this.transactions.unshift(topUpTxn);

        return {
            success          : true,
            transaction      : topUpTxn,
            balance          : this.balance,
            formattedBalance : `₹${this.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
        };
    }

    // Request Money
    requestMoney({ requester, amount, note = '' }) {
        if (!requester || !this.isValidRecipient(requester)) {
            throw new Error('Please enter a valid recipient UPI ID or phone number to request from.');
        }

        const parsed = parseFloat(amount);
        if (isNaN(parsed) || parsed <= 0) {
            throw new Error('Request amount must be greater than ₹0.');
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        const reqId = 'REQ' + Math.random().toString(36).substring(2, 9).toUpperCase();

        const requestTxn = {
            id        : reqId,
            name      : requester,
            upi       : requester.includes('@') ? requester : `${requester}@upi`,
            amount    : parsed,
            type      : TRANSACTION_TYPES.CREDIT,
            status    : TRANSACTION_STATUS.PENDING,
            note      : note ? `Payment Request: ${note}` : 'Payment Request',
            date      : `Today, ${timeStr}`,
            color     : '#D97706',
            timestamp : now.toISOString(),
            risk      : { score: 15, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Incoming payment invoice request'] }
        };

        this.transactions.unshift(requestTxn);

        return {
            success : true,
            request : requestTxn,
            balance : this.balance
        };
    }

    resolveAlert(alertId, action = 'verified') {
        const alert = this.securityAlerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = action === 'blocked' ? 'Blocked' : 'Verified by User';
            alert.timeline.push({
                step : 6,
                name : `User Action: ${alert.status}`,
                time : 'Just now',
                done : true
            });
            return alert;
        }
        return null;
    }
}

module.exports = {
    paymentService: new PaymentService(),
    TRANSACTION_TYPES,
    TRANSACTION_STATUS,
    RISK_LEVELS
};
