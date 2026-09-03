/**
 * Mock Notification Provider for PayFlow
 * Operates during development, testing, or when live Twilio credentials are not set.
 * Returns clear simulation indicators so presentations and audits remain transparent.
 */

class MockProvider {
    constructor() {
        this.name = 'MockProvider (Twilio Simulation Sandbox)';
    }

    async sendSMS({ to, body }) {
        const simulatedSid = 'SM_SIM_' + Math.random().toString(36).substring(2, 11).toUpperCase();
        console.log(`\x1b[36m[Twilio Simulation Mode - SMS]\x1b[0m Sending SMS to ${to}: "${body}" (Simulated SID: ${simulatedSid})`);
        
        return {
            success: true,
            provider: 'twilio',
            mode: 'simulation',
            status: 'simulated',
            sid: simulatedSid,
            to: to,
            body: body,
            timestamp: new Date().toISOString(),
            details: 'Twilio credentials not configured in .env. Operating in transparent simulation mode.'
        };
    }

    async makeCall({ to, message }) {
        const simulatedSid = 'CA_SIM_' + Math.random().toString(36).substring(2, 11).toUpperCase();
        console.log(`\x1b[35m[Twilio Simulation Mode - Voice Call]\x1b[0m Calling ${to} with voice prompt: "${message}" (Simulated SID: ${simulatedSid})`);
        
        return {
            success: true,
            provider: 'twilio',
            mode: 'simulation',
            status: 'simulated',
            sid: simulatedSid,
            to: to,
            message: message,
            timestamp: new Date().toISOString(),
            details: 'Twilio voice call simulated successfully.'
        };
    }

    async sendVerificationSMS({ to, amount, recipient, time, code }) {
        const body = `PaySphere Security for Vikram: Authorization required for transfer of Rs. ${amount} to ${recipient} at ${time}. Reply 1 to VERIFY, or 2 to REJECT. Verification Code: ${code}.`;
        return await this.sendSMS({ to, body });
    }

    async makeVerificationCall({ to, amount, recipient, time }) {
        const speech = `Hello Vikram, this is PaySphere Security. A transfer of ${amount} rupees to ${recipient} initiated at ${time} requires your authorization. Press 1 on your telephone keypad to approve this transaction, or press 2 to reject and block your account.`;
        return await this.makeCall({ to, message: speech });
    }

    async sendWhatsApp({ to, body }) {
        const simulatedSid = 'WA_SIM_' + Math.random().toString(36).substring(2, 11).toUpperCase();
        console.log(`\x1b[32m[Twilio Simulation Mode - WhatsApp]\x1b[0m Sending WhatsApp to ${to}: "${body}" (Simulated SID: ${simulatedSid})`);
        return {
            success: true,
            provider: 'twilio-whatsapp',
            mode: 'simulation',
            status: 'simulated',
            sid: simulatedSid,
            to: to,
            body: body,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = MockProvider;
