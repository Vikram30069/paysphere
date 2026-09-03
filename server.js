/**
 * PayFlow — Node.js / Express Backend Server
 * Provides REST APIs for payment processing, idempotency, ledger state,
 * and secure server-side Twilio SMS/Voice integrations.
 */

try {
    require('dotenv').config();
} catch (e) {
    // dotenv optional fallback
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const { paymentService } = require('./services/paymentService');
const notificationService = require('./services/notificationService');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname)));

// Login Page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// 1. Health & Status
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        service: 'PayFlow Payment Engine',
        version: '2.0.0',
        timestamp: new Date().toISOString()
    });
});

// 2. Balance API
app.get('/api/balance', (req, res) => {
    try {
        const balanceData = paymentService.getBalance();
        res.json({ success: true, ...balanceData });
    } catch (err) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
});

// 3. Transactions List API
app.get('/api/transactions', (req, res) => {
    try {
        const txns = paymentService.getTransactions();
        res.json({ success: true, count: txns.length, transactions: txns });
    } catch (err) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
});

// 4. Single Transaction API
app.get('/api/transactions/:id', (req, res) => {
    const txn = paymentService.getTransactionById(req.params.id);
    if (!txn) {
        return res.status(404).json({
            success: false,
            error: { code: 'TRANSACTION_NOT_FOUND', message: `Transaction ${req.params.id} not found.` }
        });
    }
    res.json({ success: true, transaction: txn });
});

// 5. Dashboard Statistics API
app.get('/api/stats', (req, res) => {
    try {
        const stats = paymentService.getStats();
        res.json({ success: true, stats });
    } catch (err) {
        res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
    }
});

// 6. Payment Processing API (with idempotency protection)
app.post('/api/payment', async (req, res) => {
    try {
        const { recipient, amount, note, notifySMS, notifyCall, phone } = req.body;
        const idempotencyKey = req.headers['x-idempotency-key'] || req.body.idempotencyKey;

        const result = await paymentService.processPayment({
            recipient,
            amount,
            note,
            idempotencyKey,
            notifySMS: Boolean(notifySMS),
            notifyCall: Boolean(notifyCall),
            phone
        });

        res.status(200).json(result);
    } catch (err) {
        const statusCode = err.code === 'INSUFFICIENT_BALANCE' ? 400 :
                           err.code === 'INVALID_RECIPIENT' || err.code === 'INVALID_AMOUNT' ? 422 : 500;
        res.status(statusCode).json({
            success: false,
            error: {
                code: err.code || 'TRANSACTION_FAILED',
                message: err.message || 'Payment processing failed.'
            }
        });
    }
});

// 7. Demo Top-Up API (Add Money)
app.post('/api/add-money', (req, res) => {
    try {
        const { amount, method } = req.body;
        const result = paymentService.addMoney({ amount, method });
        res.json(result);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: { code: 'TOPUP_FAILED', message: err.message }
        });
    }
});

// 8. Request Money API
app.post('/api/request-money', (req, res) => {
    try {
        const { requester, amount, note } = req.body;
        const result = paymentService.requestMoney({ requester, amount, note });
        res.json(result);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: { code: 'REQUEST_FAILED', message: err.message }
        });
    }
});

// 9. Twilio Status API (Safe - never exposes secrets)
app.get('/api/twilio/status', (req, res) => {
    res.json({
        success: true,
        ...notificationService.getStatus()
    });
});

// 10. Manual / Explicit Twilio SMS Endpoint
app.post('/api/twilio/sms', async (req, res) => {
    try {
        const { to, amount, recipient, txnId, isSecurityAlert, riskScore } = req.body;
        if (!to) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_PHONE', message: 'Recipient phone number is required.' } });
        }
        const result = await notificationService.sendPaymentSMS({ to, amount, recipient, txnId, isSecurityAlert, riskScore });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: { code: 'SMS_FAILED', message: err.message } });
    }
});

// 11. Manual / Explicit Twilio Voice Call Endpoint
app.post('/api/twilio/call', async (req, res) => {
    try {
        const { to, amount, recipient, txnId } = req.body;
        if (!to) {
            return res.status(400).json({ success: false, error: { code: 'INVALID_PHONE', message: 'Recipient phone number is required.' } });
        }
        const result = await notificationService.makeSecurityCall({ to, amount, recipient, txnId });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: { code: 'VOICE_CALL_FAILED', message: err.message } });
    }
});

// 12. Pre-Transaction Twilio Verification APIs
app.post('/api/verification/initiate', async (req, res) => {
    try {
        const { to, amount, recipient, time } = req.body;
        const result = await notificationService.initiatePreTransactionVerification({
            to        : to || '6304589007',
            amount    : amount,
            recipient : recipient,
            time      : time
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: { code: 'VERIFICATION_INIT_FAILED', message: err.message } });
    }
});

app.get('/api/verification/status/:id', (req, res) => {
    const status = notificationService.getVerificationStatus(req.params.id);
    if (!status) {
        return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Verification session expired or not found' } });
    }
    res.json({ success: true, ...status });
});

app.post('/api/verification/respond', (req, res) => {
    const { verificationId, response } = req.body;
    const result = notificationService.respondVerification(verificationId, response);
    res.json(result);
});

// 13. Twilio Incoming Webhooks for SMS and DTMF Voice Gather
app.post('/api/twilio/voice-gather', (req, res) => {
    const digit = req.body.Digits;
    const result = notificationService.respondVerification(null, digit);
    const speech = digit === '1' 
        ? 'Transaction verified successfully. Payment is now approved for Vikram.' 
        : 'Transaction rejected. Your account has been protected and payment blocked.';
    
    res.type('text/xml').send(`
        <Response>
            <Say voice="alice">${speech}</Say>
        </Response>
    `);
});

app.post('/api/twilio/incoming-sms', (req, res) => {
    const text = (req.body.Body || '').trim();
    const result = notificationService.respondVerification(null, text);
    const replyText = result.status === 'verified'
        ? 'PaySphere: Transaction authorization confirmed by Vikram. Payment is now approved.'
        : 'PaySphere: Transaction blocked and rejected as requested.';

    res.type('text/xml').send(`
        <Response>
            <Message>${replyText}</Message>
        </Response>
    `);
});

// 14. Twilio WhatsApp API & Webhook
app.post('/api/twilio/whatsapp', async (req, res) => {
    try {
        const { to, body, contentSid, contentVariables } = req.body;
        const result = await notificationService.sendWhatsApp({
            to: to || '6304589007',
            body: body || 'PaySphere WhatsApp Notification',
            contentSid,
            contentVariables
        });
        res.json(result);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/twilio/incoming-whatsapp', (req, res) => {
    const text = (req.body.Body || '').trim();
    const result = notificationService.respondVerification(null, text);
    const replyText = result.status === 'verified'
        ? 'PaySphere: WhatsApp authorization confirmed by Vikram. Payment is now approved.'
        : 'PaySphere: Transaction blocked and rejected via WhatsApp.';

    res.type('text/xml').send(`
        <Response>
            <Message>${replyText}</Message>
        </Response>
    `);
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 PayFlow Fintech Server is active on port ${PORT}`);
    console.log(`🌐 Local Web URL: http://localhost:${PORT}`);
    console.log(`📱 Twilio Status: ${notificationService.getStatus().mode.toUpperCase()} MODE (${notificationService.getStatus().provider})`);
    console.log(`======================================================\n`);
});

module.exports = app;
