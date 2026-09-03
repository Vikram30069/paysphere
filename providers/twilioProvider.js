/**
 * Twilio Live Notification Provider
 * Directly communicates with Twilio REST APIs when credentials are supplied in .env
 */

class TwilioProvider {
    constructor(accountSid, authToken, fromNumber) {
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.fromNumber = fromNumber;
        this.name = 'Twilio Live Provider';
    }

    isConfigured() {
        return !!(this.accountSid && this.authToken && this.fromNumber &&
            !this.accountSid.includes('your_') && !this.authToken.includes('your_'));
    }

    formatE164(phone) {
        if (!phone) return phone;
        const clean = String(phone).trim().replace(/[\s\-()]/g, '');
        if (clean.startsWith('+')) return clean;
        if (clean.length === 10) return `+91${clean}`;
        return `+${clean}`;
    }

    async sendSMS({ to, body }) {
        if (!this.isConfigured()) {
            throw new Error('Twilio credentials not configured');
        }

        const formattedTo = this.formatE164(to);
        const formattedFrom = this.formatE164(this.fromNumber);
        const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
        const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
        
        const params = new URLSearchParams();
        params.append('To', formattedTo);
        params.append('From', formattedFrom);
        params.append('Body', body);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Twilio SMS error: ${response.status}`);
        }

        return {
            success: true,
            provider: 'twilio',
            mode: 'live',
            status: 'delivered',
            sid: data.sid,
            to: data.to,
            body: body,
            timestamp: new Date().toISOString()
        };
    }

    async makeCall({ to, message }) {
        if (!this.isConfigured()) {
            throw new Error('Twilio credentials not configured');
        }

        const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Calls.json`;
        const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');

        const formattedTo = this.formatE164(to);
        const formattedFrom = this.formatE164(this.fromNumber);

        // Spoken TwiML message for security alert
        const twiml = `<Response><Say voice="alice">${message}</Say></Response>`;

        const params = new URLSearchParams();
        params.append('To', formattedTo);
        params.append('From', formattedFrom);
        params.append('Twiml', twiml);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Twilio Voice error: ${response.status}`);
        }

        return {
            success: true,
            provider: 'twilio',
            mode: 'live',
            status: 'initiated',
            sid: data.sid,
            to: data.to,
            message: message,
            timestamp: new Date().toISOString()
        };
    }

    async sendVerificationSMS({ to, amount, recipient, time, code }) {
        const body = `PaySphere Security for Vikram: Authorization required for transfer of Rs. ${amount} to ${recipient} at ${time}. Reply 1 to VERIFY, or 2 to REJECT. Verification Code: ${code}.`;
        return await this.sendSMS({ to, body });
    }

    async makeVerificationCall({ to, amount, recipient, time, callbackUrl }) {
        const speech = `Hello Vikram, this is PaySphere Security. A transfer of ${amount} rupees to ${recipient} initiated at ${time} requires your authorization. Press 1 on your telephone keypad to approve this transaction, or press 2 to reject and block your account.`;
        return await this.makeCall({ to, message: speech });
    }

    async sendWhatsApp({ to, body, contentSid, contentVariables }) {
        if (!this.isConfigured()) {
            throw new Error('Twilio credentials not configured');
        }

        const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${this.formatE164(to)}`;
        const fromNumber = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
        const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
        const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64');
        
        const params = new URLSearchParams();
        params.append('To', formattedTo);
        params.append('From', fromNumber);

        if (contentSid) {
            params.append('ContentSid', contentSid);
            if (contentVariables) {
                params.append('ContentVariables', typeof contentVariables === 'string' ? contentVariables : JSON.stringify(contentVariables));
            }
        } else {
            params.append('Body', body);
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || `Twilio WhatsApp error: ${response.status}`);
        }

        return {
            success   : true,
            provider  : 'twilio-whatsapp',
            mode      : 'live',
            status    : data.status,
            sid       : data.sid,
            to        : data.to,
            body      : data.body || body,
            timestamp : new Date().toISOString()
        };
    }
}

module.exports = TwilioProvider;
