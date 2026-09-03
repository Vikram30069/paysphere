/**
 * PaySphere — Notification Service
 * Orchestrates real-time SMS & Voice alerts through active providers (Twilio Live vs Mock Simulation)
 */

const TwilioProvider = require('../providers/twilioProvider');
const MockProvider = require('../providers/mockProvider');

class NotificationService {
    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        this.twilioProvider = new TwilioProvider(accountSid, authToken, fromNumber);
        this.mockProvider = new MockProvider();
    }

    getProvider() {
        if (this.twilioProvider.isConfigured()) {
            return this.twilioProvider;
        }
        return this.mockProvider;
    }

    getStatus() {
        const isLive = this.twilioProvider.isConfigured();
        return {
            configured : isLive,
            mode       : isLive ? 'live' : 'simulation',
            provider   : isLive ? 'Twilio Live API' : 'PaySphere Mock Simulation Sandbox',
            fromNumber : isLive ? (process.env.TWILIO_PHONE_NUMBER ? process.env.TWILIO_PHONE_NUMBER.replace(/\d(?=\d{4})/g, '*') : null) : 'SIMULATED'
        };
    }

    async sendPaymentSMS({ to, amount, recipient, txnId, isSecurityAlert = false, riskScore = 0 }) {
        const provider = this.getProvider();
        const formattedAmount = `Rs. ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

        let body;
        if (isSecurityAlert) {
            body = `PaySphere Fraud Alert: Unusual transaction of ${formattedAmount} to "${recipient}" was flagged on Vikram's account (Txn ID: ${txnId}). Immediate action required. Call our 24/7 security desk.`;
        } else {
            body = `PaySphere: Your payment of ${formattedAmount} to ${recipient} was successful on Vikram's account. Transaction ID: ${txnId}.`;
        }

        try {
            return await provider.sendSMS({ to, body });
        } catch (error) {
            console.error('[NotificationService] SMS Error:', error.message);
            return await this.mockProvider.sendSMS({ to, body });
        }
    }

    async makeSecurityCall({ to, amount, recipient, txnId, riskScore = 0 }) {
        const provider = this.getProvider();
        const formattedAmount = `${parseFloat(amount)} rupees`;
        const message = `PaySphere Fraud Alert for Vikram. An unusual transaction of ${formattedAmount} to ${recipient} with ID ${txnId} was flagged on Vikram's account. Immediate action is required. Please secure your account or contact our 24/7 security desk immediately.`;

        try {
            return await provider.makeCall({ to, message });
        } catch (error) {
            console.error('[NotificationService] Call Error:', error.message);
            return await this.mockProvider.makeCall({ to, message });
        }
    }

    async sendWhatsApp({ to, body, contentSid, contentVariables }) {
        const provider = this.getProvider();
        try {
            return await provider.sendWhatsApp({ to, body, contentSid, contentVariables });
        } catch (error) {
            console.error('[NotificationService] WhatsApp Error:', error.message);
            return await this.mockProvider.sendWhatsApp({ to, body, contentSid, contentVariables });
        }
    }

    // --- PRE-TRANSACTION VERIFICATION WORKFLOW ---

    async initiatePreTransactionVerification({ to, amount, recipient, time }) {
        if (!this.activeVerifications) {
            this.activeVerifications = new Map();
        }

        const verificationId = 'VERIFY_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = String(Math.floor(1000 + Math.random() * 9000));
        const provider = this.getProvider();

        const record = {
            id        : verificationId,
            to        : to || '6304589007',
            amount    : amount,
            recipient : recipient,
            time      : time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            code      : code,
            status    : 'pending', // 'pending' | 'verified' | 'rejected'
            createdAt : Date.now()
        };

        this.activeVerifications.set(verificationId, record);

        // Dispatch live Twilio SMS, Voice call, and WhatsApp asynchronously
        const smsPromise = provider.sendVerificationSMS({
            to        : record.to,
            amount    : record.amount,
            recipient : record.recipient,
            time      : record.time,
            code      : record.code
        }).catch(err => console.warn('[Verification SMS]', err.message));

        const callPromise = provider.makeVerificationCall({
            to        : record.to,
            amount    : record.amount,
            recipient : record.recipient,
            time      : record.time
        }).catch(err => console.warn('[Verification Call]', err.message));

        const waPromise = provider.sendWhatsApp({
            to   : record.to,
            body : `🛡️ PaySphere Security for Vikram: Authorization required for transfer of Rs. ${record.amount} to ${record.recipient} at ${record.time}. Reply 1 to VERIFY, or 2 to REJECT. Verification Code: ${record.code}.`
        }).catch(err => console.warn('[Verification WhatsApp]', err.message));

        // Let background network finish
        Promise.allSettled([smsPromise, callPromise, waPromise]).then(results => {
            console.log(`[Verification ${verificationId}] Twilio SMS, Call & WhatsApp dispatch completed.`);
        });

        return {
            success        : true,
            verificationId : verificationId,
            to             : record.to,
            code           : code,
            status         : 'pending',
            instructions   : 'Type 1 to verify, 2 to reject on your phone or enter the 4-digit code.'
        };
    }

    getVerificationStatus(verificationId) {
        if (!this.activeVerifications) return null;
        return this.activeVerifications.get(verificationId) || null;
    }

    respondVerification(verificationId, response) {
        if (!this.activeVerifications) return { success: false, message: 'No active session' };
        
        // Find record by id or find latest for phone
        let record = this.activeVerifications.get(verificationId);
        if (!record) {
            // Find latest pending record
            for (const [id, r] of this.activeVerifications.entries()) {
                if (r.status === 'pending') {
                    record = r;
                    break;
                }
            }
        }

        if (!record) {
            return { success: false, message: 'No pending verification session found' };
        }

        const input = String(response).trim();
        if (input === '1' || input === record.code || input.toLowerCase() === 'verify') {
            record.status = 'verified';
            record.verifiedAt = Date.now();
            return { success: true, status: 'verified', message: 'Transaction verified successfully. Payment enabled.' };
        } else if (input === '2' || input.toLowerCase() === 'reject') {
            record.status = 'rejected';
            record.rejectedAt = Date.now();
            return { success: true, status: 'rejected', message: 'Transaction rejected by Vikram. Payment blocked.' };
        }

        return { success: false, status: 'invalid', message: 'Invalid response. Reply 1 to verify or 2 to reject.' };
    }
}

module.exports = new NotificationService();
