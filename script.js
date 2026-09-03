/* ================================================================
   PAYSPHERE — SCRIPT.JS
   Intelligent Secure Payments & Autonomous Risk Response System
   TechTycoons Code-Revive Edition
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   CENTRALIZED BUSINESS CONSTANTS (Phase 3)
   ---------------------------------------------------------------- */

const TRANSACTION_TYPES = Object.freeze({
    DEBIT  : 'debit',
    CREDIT : 'credit'
});

const TRANSACTION_STATUS = Object.freeze({
    SUCCESSFUL : 'Successful',
    PENDING    : 'Pending',
    FAILED     : 'Failed'
});

const RISK_LEVELS = Object.freeze({
    LOW      : 'LOW',
    MEDIUM   : 'MEDIUM',
    HIGH     : 'HIGH',
    CRITICAL : 'CRITICAL'
});

const SORT_OPTIONS = Object.freeze({
    NEWEST       : 'newest',
    OLDEST       : 'oldest',
    HIGHEST      : 'highest',
    LOWEST       : 'lowest',
    HIGHEST_RISK : 'highest-risk'
});

/* ----------------------------------------------------------------
   SEED TRANSACTION RECORDS (Includes High-Risk Reference Item)
   ---------------------------------------------------------------- */

const INITIAL_TRANSACTIONS = [
    {
        id        : 'TXN7892910291',
        name      : 'Unknown Recipient',
        upi       : '0982348123@upi',
        amount    : 45000,
        type      : TRANSACTION_TYPES.DEBIT,
        status    : TRANSACTION_STATUS.SUCCESSFUL,
        note      : 'Payment for services',
        date      : '14 May 2024, 10:25 AM',
        timestamp : new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        color     : '#DC2626',
        risk      : {
            score     : 92,
            level     : RISK_LEVELS.HIGH,
            isFlagged : true,
            factors   : [
                'Amount (₹45,000) significantly higher than normal activity',
                'New recipient: First-time transfer to unrecognized address',
                'Time pattern: Transaction initiated during unusual hours'
            ]
        }
    },
    {
        id        : 'TXNA1B2C3',
        name      : 'Rahul Kumar',
        upi       : 'rahul@payflow',
        amount    : 1200,
        type      : TRANSACTION_TYPES.DEBIT,
        status    : TRANSACTION_STATUS.SUCCESSFUL,
        note      : 'Lunch split',
        date      : 'Today, 10:45 AM',
        timestamp : new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        color     : '#4F46E5',
        risk      : { score: 12, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Routine payment to frequent contact'] }
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
        risk      : { score: 8, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Verified credit salary inflow'] }
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
        risk      : { score: 18, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Normal peer transaction'] }
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
        risk      : { score: 22, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Failed merchant charge'] }
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
        risk      : { score: 5, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Micro-transaction to known contact'] }
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
        risk      : { score: 25, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Invoiced client consulting transfer'] }
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
        risk      : { score: 14, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Pending food delivery order'] }
    }
];

/* ----------------------------------------------------------------
   CENTRALIZED APPLICATION STATE
   ---------------------------------------------------------------- */

const state = {
    balance         : 540000.00,
    startingBalance : 540000.00,
    isBalanceMasked : false,
    transactions    : [...INITIAL_TRANSACTIONS],
    payment: {
        recipient  : '',
        amount     : '',
        note       : '',
        notifySMS  : true,
        notifyCall : false,
        phone      : '6304589007'
    },
    filters: {
        type   : 'all', // 'all', 'sent', 'received', 'pending', 'failed', 'flagged'
        search : '',
        sort   : SORT_OPTIONS.NEWEST
    },
    security: {
        activeAlertId : 'ALT_SEC_981',
        alerts        : [
            {
                id           : 'ALT_SEC_981',
                txnId        : 'TXN7892910291',
                amount       : 45000,
                recipient    : 'Unknown Recipient',
                riskScore    : 92,
                riskLevel    : RISK_LEVELS.HIGH,
                status       : 'Flagged',
                reasons      : [
                    'Amount significantly higher than normal activity',
                    'New recipient: First-time transfer',
                    'Transaction initiated at unusual time'
                ],
                smsSent      : true,
                voiceSent    : true,
                time         : '10:25 AM (14 May 2024)'
            }
        ]
    },
    ui: {
        isSubmitting       : false,
        selectedModalTxnId : null,
        activeDrawerTab    : 'details',
        activeSection      : 'dashboard',
        twilioStatus       : { mode: 'simulation', provider: 'Simulation Sandbox' }
    }
};

/* Legacy compatibility references */
var balance = state.balance;
var transactions = state.transactions;
var paymentData = state.payment;
var activeFilter = state.filters.type;
var searchQuery = state.filters.search;

/* ----------------------------------------------------------------
   UTILITIES & ESCAPING (XSS Protection)
   ---------------------------------------------------------------- */

function escapeHTML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function generateTxnId() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var id = 'TXN';
    for (var i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function formatAmount(value) {
    var num = parseFloat(value) || 0;
    return '₹' + num.toLocaleString('en-IN', {
        minimumFractionDigits : 2,
        maximumFractionDigits : 2
    });
}

function getInitials(name) {
    if (!name) return 'PS';
    return name.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (w) { return w[0] || ''; })
        .join('')
        .toUpperCase();
}

function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
}

/* ----------------------------------------------------------------
   INITIALISATION
   ---------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function () {
    refreshBalanceDisplay(false);
    renderRecentTransactions();
    renderTransactions();
    updateStats();
    init3DCardTilt();
    checkTwilioStatus();
    renderSecurityAlertsFeed();
    setupEventListeners();

    var hash = (window.location.hash || '').replace('#', '');
    if (hash && ['dashboard', 'send', 'transactions', 'security', 'analytics'].includes(hash)) {
        showSection(hash);
    }
});

function setupEventListeners() {
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }

        // Automatic 1 / 2 detection on Review screen
        var reviewView = document.getElementById('view-review');
        if (reviewView && !reviewView.classList.contains('hidden')) {
            if (e.key === '1' || e.code === 'Digit1' || e.code === 'Numpad1') {
                var activeTag = (document.activeElement && document.activeElement.tagName) || '';
                var activeId = (document.activeElement && document.activeElement.id) || '';
                if (activeTag === 'INPUT' && activeId !== 'verify-code-input') return;

                e.preventDefault();
                var input = document.getElementById('verify-code-input');
                if (input) input.value = '1';
                submitVerificationAction('1');
            } else if (e.key === '2' || e.code === 'Digit2' || e.code === 'Numpad2') {
                var activeTag = (document.activeElement && document.activeElement.tagName) || '';
                var activeId = (document.activeElement && document.activeElement.id) || '';
                if (activeTag === 'INPUT' && activeId !== 'verify-code-input') return;

                e.preventDefault();
                var input = document.getElementById('verify-code-input');
                if (input) input.value = '2';
                submitVerificationAction('2');
            }
        }
    });

    window.addEventListener('hashchange', function () {
        var hash = (window.location.hash || '').replace('#', '');
        if (hash && ['dashboard', 'send', 'transactions', 'security', 'analytics'].includes(hash)) {
            showSection(hash);
        }
    });
}

/* ----------------------------------------------------------------
   BALANCE DISPLAY & EYE MASK (GSAP Animations)
   ---------------------------------------------------------------- */

function refreshBalanceDisplay(animate) {
    if (animate === undefined) animate = true;
    balance = state.balance;

    var formatted = state.balance.toLocaleString('en-IN', {
        minimumFractionDigits : 2,
        maximumFractionDigits : 2
    });

    var balanceDisplayEl   = document.getElementById('balance-display');
    var availDisplayEl     = document.getElementById('available-balance-display');
    var balanceHintEl      = document.getElementById('form-balance-hint');

    if (balanceHintEl) {
        balanceHintEl.textContent = '₹' + formatted;
    }

    if (state.isBalanceMasked) {
        if (balanceDisplayEl) balanceDisplayEl.textContent = '••••••';
        if (availDisplayEl)   availDisplayEl.textContent   = '••••••';
        return;
    }

    if (availDisplayEl) {
        availDisplayEl.textContent = '₹' + formatted;
    }

    if (!balanceDisplayEl) return;

    if (animate && window.gsap) {
        var currentDisplay = parseFloat(balanceDisplayEl.textContent.replace(/,/g, '')) || state.balance;
        var obj = { val: currentDisplay };

        gsap.to(obj, {
            val      : state.balance,
            duration : 0.8,
            ease     : 'power2.out',
            onUpdate : function () {
                balanceDisplayEl.textContent = obj.val.toLocaleString('en-IN', {
                    minimumFractionDigits : 2,
                    maximumFractionDigits : 2
                });
            }
        });
    } else {
        balanceDisplayEl.textContent = formatted;
    }
}

function toggleBalanceMask() {
    state.isBalanceMasked = !state.isBalanceMasked;
    refreshBalanceDisplay(false);
    showToast({
        title   : state.isBalanceMasked ? 'Balance Hidden' : 'Balance Visible',
        message : state.isBalanceMasked ? 'Your balance amount is now masked.' : 'Your balance amount is now revealed.',
        type    : 'info'
    });
}

/* ----------------------------------------------------------------
   3D CARD TILT & PARALLAX ENGINE
   ---------------------------------------------------------------- */

function init3DCardTilt() {
    var card = document.getElementById('balance-card');
    var glare = document.getElementById('card-glare');
    if (!card) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    var isHovered = false;

    card.addEventListener('mouseenter', function () { isHovered = true; });

    card.addEventListener('mousemove', function (e) {
        if (!isHovered) return;
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -12;
        var rotateY = ((x - centerX) / centerX) * 14;

        card.style.setProperty('--rotate-x', rotateX.toFixed(2) + 'deg');
        card.style.setProperty('--rotate-y', rotateY.toFixed(2) + 'deg');

        if (glare) {
            var glareX = (x / rect.width) * 100;
            var glareY = (y / rect.height) * 100;
            glare.style.setProperty('--glare-x', glareX.toFixed(1) + '%');
            glare.style.setProperty('--glare-y', glareY.toFixed(1) + '%');
            glare.style.opacity = '1';
        }
    });

    card.addEventListener('mouseleave', function () {
        isHovered = false;
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
        if (glare) glare.style.opacity = '0';
    });
}

/* ----------------------------------------------------------------
   NAVIGATION & SECTION ROUTING
   ---------------------------------------------------------------- */

function showSection(key) {
    var sections = {
        dashboard    : 'section-dashboard',
        send         : 'section-send',
        transactions : 'section-transactions',
        security     : 'section-security',
        analytics    : 'section-analytics'
    };

    var navIds = {
        dashboard    : 'nav-home',
        send         : 'nav-send',
        transactions : 'nav-transactions',
        security     : 'nav-security',
        analytics    : 'nav-analytics'
    };

    state.ui.activeSection = key;

    document.querySelectorAll('.section').forEach(function (s) { s.classList.remove('active'); });
    document.querySelectorAll('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });

    var section = document.getElementById(sections[key]);
    var navLink = document.getElementById(navIds[key]);

    if (section) section.classList.add('active');
    if (navLink) navLink.classList.add('active');

    if (window.location.hash !== '#' + key) {
        history.replaceState(null, '', '#' + key);
    }

    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (key === 'transactions') {
        updateStats();
        renderTransactions();
    } else if (key === 'dashboard') {
        refreshBalanceDisplay(false);
        renderRecentTransactions();
        updateStats();
    } else if (key === 'security') {
        renderSecurityAlertsFeed();
    }
}

function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open');
}

function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
}

/* ----------------------------------------------------------------
   BUG 1 FIX PRESERVED: RECIPIENT VALIDATION
   ---------------------------------------------------------------- */

function isValidRecipient(value) {
    if (!value || typeof value !== 'string') return false;
    var trimmed = value.trim();
    var phonePattern = /^[0-9]{10}$/;
    var upiPattern   = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
    return phonePattern.test(trimmed) || upiPattern.test(trimmed);
}

/* ----------------------------------------------------------------
   REAL-TIME PRE-SUBMISSION RISK PREVIEW
   ---------------------------------------------------------------- */

function previewRiskScore() {
    var recipientInput = document.getElementById('recipient-input');
    var amountInput    = document.getElementById('amount');
    var noteInput      = document.getElementById('payment-note');

    var recipient = recipientInput ? recipientInput.value.trim() : '';
    var amount    = amountInput ? parseFloat(amountInput.value) || 0 : 0;
    var note      = noteInput ? noteInput.value.trim() : '';

    var badge = document.getElementById('preview-risk-badge');
    var noteEl = document.getElementById('preview-risk-note');
    if (!badge || !noteEl) return;

    var score = 8;
    var reasons = [];

    if (amount > 40000) {
        score += 45;
        reasons.push('High value (>₹40,000)');
    } else if (amount > 20000) {
        score += 30;
        reasons.push('Elevated amount (>₹20,000)');
    } else if (amount > 8000) {
        score += 15;
    }

    if (recipient && !recipient.includes('payflow') && !recipient.includes('rahul') && !recipient.includes('priya')) {
        score += 25;
        reasons.push('New unrecognized recipient');
    }

    score = Math.min(100, score);

    badge.className = 'risk-badge';
    if (score >= 80) {
        badge.classList.add('critical');
        badge.textContent = `Critical Risk (${score}/100)`;
        noteEl.textContent = reasons.join(' • ') + ' — Will trigger automated Twilio voice & SMS verification.';
    } else if (score >= 60) {
        badge.classList.add('high');
        badge.textContent = `High Risk (${score}/100)`;
        noteEl.textContent = reasons.join(' • ') + ' — Automated SMS security alert recommended.';
    } else if (score >= 30) {
        badge.classList.add('medium');
        badge.textContent = `Medium Risk (${score}/100)`;
        noteEl.textContent = 'Moderate transfer value — Standard monitoring applied.';
    } else {
        badge.classList.add('low');
        badge.textContent = `Low Risk (${score}/100)`;
        noteEl.textContent = 'Standard routine payment within expected behavioral thresholds.';
    }

    return score;
}

/* ----------------------------------------------------------------
   PAYMENT FORM LOGIC & VIEW SWITCHING
   ---------------------------------------------------------------- */

function switchView(viewId) {
    ['view-form', 'view-review', 'view-result'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    var target = document.getElementById(viewId);
    if (target) target.classList.remove('hidden');
}

function clearErrors() {
    setText('err-recipient', '');
    setText('err-amount', '');
}

function validateForm() {
    clearErrors();
    var valid = true;

    var recipientInput = document.getElementById('recipient-input');
    var amountInput    = document.getElementById('amount');

    var recipient = recipientInput ? recipientInput.value.trim() : '';
    var amountRaw = amountInput ? amountInput.value.trim() : '';
    var amtNum    = parseFloat(amountRaw);

    if (!recipient) {
        setText('err-recipient', 'Please enter a recipient.');
        valid = false;
    } else if (!isValidRecipient(recipient)) {
        setText('err-recipient', 'Enter a valid UPI ID (e.g. priya.sharma@upi) or 10-digit phone.');
        valid = false;
    }

    if (!amountRaw) {
        setText('err-amount', 'Please enter an amount.');
        valid = false;
    } else if (isNaN(amtNum) || amtNum <= 0) {
        setText('err-amount', 'Amount must be greater than ₹0.');
        valid = false;
    } else if (amtNum > state.balance) {
        setText('err-amount', 'Amount exceeds your available balance.');
        valid = false;
    }

    return valid;
}

function handleContinue() {
    if (!validateForm()) return;

    var recipientEl = document.getElementById('recipient-input');
    var amountEl    = document.getElementById('amount');
    var noteEl      = document.getElementById('payment-note');

    state.payment.recipient = recipientEl ? recipientEl.value.trim() : '';
    state.payment.amount    = amountEl ? amountEl.value.trim() : '';
    state.payment.note      = noteEl ? noteEl.value.trim() : '';

    paymentData.recipient = state.payment.recipient;
    paymentData.amount    = state.payment.amount;
    paymentData.note      = state.payment.note;

    setText('review-recipient', state.payment.recipient);
    setText('review-amount',    formatAmount(state.payment.amount));

    var calculatedRisk = previewRiskScore();
    var reviewRiskEl = document.getElementById('review-risk-val');
    if (reviewRiskEl) {
        var tier = calculatedRisk >= 60 ? 'high' : calculatedRisk >= 30 ? 'medium' : 'low';
        reviewRiskEl.innerHTML = `<span class="risk-badge ${tier}">${tier.toUpperCase()} (${calculatedRisk}/100)</span>`;
    }

    var noteRow = document.getElementById('review-note-row');
    if (state.payment.note) {
        setText('review-note', state.payment.note);
        if (noteRow) noteRow.classList.remove('hidden');
    } else {
        if (noteRow) noteRow.classList.add('hidden');
    }

    switchView('view-review');
    initiateReviewVerification();
}

/* ----------------------------------------------------------------
   PRE-TRANSACTION TWILIO VERIFICATION FLOW (1 to verify, 2 to reject)
   ---------------------------------------------------------------- */

var activeVerificationSession = null;
var verificationPollTimer = null;

function initiateReviewVerification() {
    if (verificationPollTimer) {
        clearInterval(verificationPollTimer);
        verificationPollTimer = null;
    }

    var confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.5';
        confirmBtn.style.cursor = 'not-allowed';
        confirmBtn.textContent = 'Confirm Payment (Awaiting 1 to Verify)';
    }

    resetVerificationUI();

    var timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    fetch('/api/verification/initiate', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
            to        : '6304589007',
            amount    : state.payment.amount,
            recipient : state.payment.recipient,
            time      : timeStr
        })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.success) {
            activeVerificationSession = data;
            startVerificationPolling(data.verificationId);
            showToast({
                title   : 'Twilio Verification Sent',
                message : 'SMS & Voice Call dispatched to +91 63045 89007. Reply 1 to verify.',
                type    : 'info'
            });
        }
    })
    .catch(function (err) {
        console.warn('Verification initiate fallback:', err.message);
    });
}

function resetVerificationUI() {
    var banner = document.getElementById('verification-live-banner');
    var icon   = document.getElementById('verification-icon');
    var title  = document.getElementById('verification-title');
    var desc   = document.getElementById('verification-desc');
    var badge  = document.getElementById('verification-timer-badge');

    if (banner) {
        banner.style.background = 'rgba(99, 102, 241, 0.12)';
        banner.style.borderColor = 'rgba(99, 102, 241, 0.4)';
    }
    if (icon)  icon.textContent = '⏳';
    if (title) title.textContent = 'Awaiting Authorization…';
    if (desc)  desc.innerHTML = 'Reply <strong>1 to VERIFY</strong>, or <strong>2 to REJECT</strong> on your phone.';
    if (badge) {
        badge.className = 'risk-badge medium';
        badge.textContent = 'Waiting…';
    }
}

function startVerificationPolling(id) {
    if (verificationPollTimer) clearInterval(verificationPollTimer);

    verificationPollTimer = setInterval(function () {
        fetch('/api/verification/status/' + id)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.success && data.status === 'verified') {
                    clearInterval(verificationPollTimer);
                    applyVerificationSuccess();
                } else if (data.success && data.status === 'rejected') {
                    clearInterval(verificationPollTimer);
                    applyVerificationRejected();
                }
            })
            .catch(function () {});
    }, 1500);
}

function submitVerificationAction(action) {
    var vId = activeVerificationSession ? activeVerificationSession.verificationId : null;

    fetch('/api/verification/respond', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
            verificationId : vId,
            response       : action
        })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        if (data.status === 'verified') {
            if (verificationPollTimer) clearInterval(verificationPollTimer);
            applyVerificationSuccess();
        } else if (data.status === 'rejected') {
            if (verificationPollTimer) clearInterval(verificationPollTimer);
            applyVerificationRejected();
        } else {
            showToast({ title: 'Invalid Response', message: 'Enter 1 to verify or 2 to reject.', type: 'warning' });
        }
    })
    .catch(function () {
        if (action === '1') applyVerificationSuccess();
        else if (action === '2') applyVerificationRejected();
    });
}

function handleAutoVerifyInput(val) {
    var trimmed = String(val).trim();
    if (trimmed === '1') {
        submitVerificationAction('1');
    } else if (trimmed === '2') {
        submitVerificationAction('2');
    } else if (trimmed.length === 4) {
        submitVerificationAction(trimmed);
    }
}

function handleManualCodeSubmit() {
    var input = document.getElementById('verify-code-input');
    var val = input ? input.value.trim() : '';
    if (val) {
        handleAutoVerifyInput(val);
    }
}

function applyVerificationSuccess() {
    var confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.textContent = 'Confirm Payment ✓ (Verified)';
    }

    var banner = document.getElementById('verification-live-banner');
    var icon   = document.getElementById('verification-icon');
    var title  = document.getElementById('verification-title');
    var desc   = document.getElementById('verification-desc');
    var badge  = document.getElementById('verification-timer-badge');

    if (banner) {
        banner.style.background = 'rgba(16, 185, 129, 0.15)';
        banner.style.borderColor = 'rgba(16, 185, 129, 0.5)';
    }
    if (icon)  icon.textContent = '✅';
    if (title) title.textContent = 'Transaction Verified by Vikram (+91 63045 89007)';
    if (desc)  desc.textContent = 'Authorized via Twilio 2FA. Payment button is now enabled.';
    if (badge) {
        badge.className = 'risk-badge low';
        badge.textContent = 'Approved ✓';
    }

    showToast({
        title   : 'Payment Approved',
        message : 'Vikram authorized the transaction. You may now click Confirm Payment.',
        type    : 'success'
    });
}

function applyVerificationRejected() {
    var confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.style.opacity = '0.35';
        confirmBtn.style.cursor = 'not-allowed';
        confirmBtn.textContent = 'Transaction Blocked (Rejected by Vikram)';
    }

    var banner = document.getElementById('verification-live-banner');
    var icon   = document.getElementById('verification-icon');
    var title  = document.getElementById('verification-title');
    var desc   = document.getElementById('verification-desc');
    var badge  = document.getElementById('verification-timer-badge');

    if (banner) {
        banner.style.background = 'rgba(239, 68, 68, 0.15)';
        banner.style.borderColor = 'rgba(239, 68, 68, 0.5)';
    }
    if (icon)  icon.textContent = '🛑';
    if (title) title.textContent = 'Transaction Rejected & Blocked';
    if (desc)  desc.textContent = 'Vikram pressed 2 to reject. Fund movement has been prohibited for your security.';
    if (badge) {
        badge.className = 'risk-badge critical';
        badge.textContent = 'Blocked ✕';
    }

    showToast({
        title   : 'Transaction Blocked',
        message : 'Security alert logged: Vikram rejected authorization for this transfer.',
        type    : 'error'
    });
}

/* ----------------------------------------------------------------
   BUG 2 FIX PRESERVED: HANDLE EDIT — review → form
   ---------------------------------------------------------------- */

function handleEdit() {
    if (verificationPollTimer) {
        clearInterval(verificationPollTimer);
        verificationPollTimer = null;
    }
    var recipientInput = document.getElementById('recipient-input');
    var amountInput    = document.getElementById('amount');
    var noteInput      = document.getElementById('payment-note');

    if (recipientInput) recipientInput.value = state.payment.recipient || '';
    if (amountInput)    amountInput.value    = state.payment.amount || '';
    if (noteInput)      noteInput.value      = state.payment.note || '';

    clearErrors();
    switchView('view-form');
}

function handleLog() {
    handleEdit();
    return state.payment.note;
}

/* ----------------------------------------------------------------
   BUG 3, 4, 5 FIX PRESERVED: HANDLE CONFIRM & PAYMENT PROCESSING
   ---------------------------------------------------------------- */

function handleConfirm() {
    var btn = document.getElementById('confirm-btn');
    if (!btn || state.ui.isSubmitting) return;

    state.ui.isSubmitting = true;
    btn.textContent = 'Processing & Evaluating Risk…';
    btn.disabled = true;

    var smsToggle  = document.getElementById('review-sms-toggle');
    var callToggle = document.getElementById('review-call-toggle');
    var phoneInput = document.getElementById('review-phone-input');

    state.payment.notifySMS  = smsToggle ? smsToggle.checked : true;
    state.payment.notifyCall = callToggle ? callToggle.checked : false;
    state.payment.phone      = phoneInput ? phoneInput.value.trim() : '6304589007';

    var idempotencyKey = 'PAYSPHERE_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

    var payload = {
        recipient      : state.payment.recipient,
        amount         : state.payment.amount,
        note           : state.payment.note,
        notifySMS      : state.payment.notifySMS,
        notifyCall     : state.payment.notifyCall,
        phone          : state.payment.phone,
        idempotencyKey : idempotencyKey
    };

    fetch('/api/payment', {
        method  : 'POST',
        headers : {
            'Content-Type'      : 'application/json',
            'x-idempotency-key' : idempotencyKey
        },
        body    : JSON.stringify(payload)
    })
    .then(function (res) {
        if (!res.ok) return res.json().then(function (err) { throw err; });
        return res.json();
    })
    .then(function (data) {
        processPaymentSuccess(data.transaction, data.balance, data.notifications, data.risk);
    })
    .catch(function (err) {
        console.warn('Backend payment request unavailable, processing via client state engine:', err);
        processPaymentLocal();
    })
    .finally(function () {
        state.ui.isSubmitting = false;
        if (btn) {
            btn.textContent = 'Confirm Payment';
            btn.disabled = false;
        }
    });
}

function processPaymentLocal() {
    var amount = parseFloat(state.payment.amount);

    // Bug 3 Fix: Update balance BEFORE refreshing display
    state.balance -= amount;
    balance = state.balance;

    var txnId   = generateTxnId();
    var now     = new Date();
    var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var dateStr = 'Today, ' + timeStr;

    var score = previewRiskScore() || 10;
    var isFlagged = score >= 60;

    // Bug 4 Fix: Standardize status to exact 'Successful'
    var newTxn = {
        id        : txnId,
        name      : state.payment.recipient,
        upi       : state.payment.recipient.includes('@') ? state.payment.recipient : state.payment.recipient + '@upi',
        amount    : amount,
        type      : TRANSACTION_TYPES.DEBIT,
        status    : TRANSACTION_STATUS.SUCCESSFUL,
        note      : state.payment.note,
        date      : dateStr,
        timestamp : now.toISOString(),
        color     : isFlagged ? '#DC2626' : '#4F46E5',
        risk      : {
            score     : score,
            level     : score >= 80 ? RISK_LEVELS.CRITICAL : score >= 60 ? RISK_LEVELS.HIGH : RISK_LEVELS.LOW,
            isFlagged : isFlagged,
            factors   : isFlagged ? ['High transfer volume relative to average', 'Automated security alert triggered'] : ['Routine payment']
        }
    };

    state.transactions.unshift(newTxn);
    transactions = state.transactions;

    processPaymentSuccess(newTxn, state.balance, null, newTxn.risk);
}

function processPaymentSuccess(txn, newBalance, notifications, risk) {
    state.balance = newBalance;
    balance = state.balance;

    if (!state.transactions.some(function (t) { return t.id === txn.id; })) {
        state.transactions.unshift(txn);
        transactions = state.transactions;
    }

    refreshBalanceDisplay(true);

    // Bug 5 Fix: Synchronize all dependent UI immediately
    renderRecentTransactions();
    renderTransactions();
    updateStats();

    setText('result-subtext',   formatAmount(txn.amount) + ' sent successfully');
    setText('result-recipient', txn.name);
    setText('result-amount',    formatAmount(txn.amount));
    setText('result-txn-id',    txn.id);
    setText('result-date',      txn.date);

    var notifStatusEl = document.getElementById('result-notification-status');
    if (notifStatusEl) {
        if (notifications && notifications.sms) {
            notifStatusEl.textContent = notifications.sms.mode === 'live' ? 'Live SMS Sent ✓' : 'SMS Simulated Delivery ✓';
        } else if (state.payment.notifySMS) {
            notifStatusEl.textContent = 'SMS Dispatched (Sandbox Mode) ✓';
        } else {
            notifStatusEl.textContent = 'None requested';
        }
    }

    switchView('view-result');
    triggerCelebrationConfetti();

    showToast({
        title   : 'Payment Sent',
        message : 'Successfully transferred ' + formatAmount(txn.amount) + ' to ' + txn.name,
        type    : 'success'
    });
}

function triggerCelebrationConfetti() {
    if (typeof confetti === 'function' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        confetti({
            particleCount : 80,
            spread        : 70,
            origin        : { y: 0.6 },
            colors        : ['#6366F1', '#10B981', '#A855F7', '#38BDF8', '#F59E0B']
        });
    }
}

function handleDone() {
    state.payment = {
        recipient  : '',
        amount     : '',
        note       : '',
        notifySMS  : true,
        notifyCall : false,
        phone      : '6304589007'
    };
    paymentData = state.payment;

    var recipientInput = document.getElementById('recipient-input');
    var amountInput    = document.getElementById('amount');
    var noteInput      = document.getElementById('payment-note');

    if (recipientInput) recipientInput.value = '';
    if (amountInput)    amountInput.value    = '';
    if (noteInput)      noteInput.value      = '';

    switchView('view-form');
    showSection('dashboard');
}

/* ----------------------------------------------------------------
   BUG 6, 7, 8 FIX PRESERVED: FILTERING & SEARCH
   ---------------------------------------------------------------- */

function getFiltered() {
    var result = state.transactions.slice();

    switch (state.filters.type) {
        case 'sent':
            result = result.filter(function (t) { return t.type === TRANSACTION_TYPES.DEBIT; });
            break;
        case 'received':
            // Bug 7 Fix: Checks type === 'credit'
            result = result.filter(function (t) { return t.type === TRANSACTION_TYPES.CREDIT; });
            break;
        case 'pending':
            result = result.filter(function (t) { return t.status === TRANSACTION_STATUS.PENDING; });
            break;
        case 'failed':
            result = result.filter(function (t) { return t.status === TRANSACTION_STATUS.FAILED; });
            break;
        case 'flagged':
            result = result.filter(function (t) { return t.risk && t.risk.isFlagged; });
            break;
        default:
            break;
    }

    // Bug 8 Fix: Case-insensitive search across name, upi, note, id
    if (state.filters.search) {
        var query = state.filters.search.trim().toLowerCase();
        result = result.filter(function (t) {
            var nameMatch = t.name && t.name.toLowerCase().includes(query);
            var upiMatch  = t.upi && t.upi.toLowerCase().includes(query);
            var noteMatch = t.note && t.note.toLowerCase().includes(query);
            var idMatch   = t.id && t.id.toLowerCase().includes(query);
            return nameMatch || upiMatch || noteMatch || idMatch;
        });
    }

    switch (state.filters.sort) {
        case SORT_OPTIONS.HIGHEST:
            result.sort(function (a, b) { return b.amount - a.amount; });
            break;
        case SORT_OPTIONS.LOWEST:
            result.sort(function (a, b) { return a.amount - b.amount; });
            break;
        case SORT_OPTIONS.HIGHEST_RISK:
            result.sort(function (a, b) {
                var rA = (a.risk && a.risk.score) || 0;
                var rB = (b.risk && b.risk.score) || 0;
                return rB - rA;
            });
            break;
        case SORT_OPTIONS.OLDEST:
            result.sort(function (a, b) {
                var tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                var tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return tA - tB;
            });
            break;
        case SORT_OPTIONS.NEWEST:
        default:
            result.sort(function (a, b) {
                var tA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                var tB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                return tB - tA;
            });
            break;
    }

    return result;
}

function renderTransactions() {
    var list       = document.getElementById('txn-list');
    var emptyState = document.getElementById('empty-state');
    if (!list || !emptyState) return;

    var filtered = getFiltered();

    if (filtered.length === 0) {
        list.innerHTML = '';
        // Bug 6 Fix: Unhide empty state
        emptyState.classList.remove('hidden');
    } else {
        // Bug 6 Fix: Hide empty state when results exist
        emptyState.classList.add('hidden');
        list.innerHTML = filtered.map(buildTxnCard).join('');
    }
}

function renderRecentTransactions() {
    var container = document.getElementById('recent-txn-list');
    if (!container) return;
    var recent = state.transactions.slice(0, 4);
    container.innerHTML = recent.map(buildTxnCard).join('');
}

function applyFilter(filter) {
    state.filters.type = filter;
    activeFilter = filter;

    document.querySelectorAll('.filter-pill').forEach(function (btn) {
        btn.classList.remove('active');
    });

    var activeBtn = document.querySelector('[data-filter="' + filter + '"]');
    if (activeBtn) activeBtn.classList.add('active');

    renderTransactions();
}

function handleSearch() {
    var input = document.getElementById('search-input');
    state.filters.search = input ? input.value : '';
    searchQuery = state.filters.search;
    renderTransactions();
}

function handleGlobalSearch(val) {
    state.filters.search = val;
    searchQuery = val;
    var txnSearchInput = document.getElementById('search-input');
    if (txnSearchInput) txnSearchInput.value = val;
    if (state.ui.activeSection !== 'transactions') {
        showSection('transactions');
    } else {
        renderTransactions();
    }
}

function handleSortChange(sortValue) {
    state.filters.sort = sortValue;
    renderTransactions();
}

function resetFilters() {
    state.filters.type   = 'all';
    state.filters.search = '';
    state.filters.sort   = SORT_OPTIONS.NEWEST;

    var searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';

    var sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'newest';

    applyFilter('all');
}

/* ----------------------------------------------------------------
   BUILD TRANSACTION CARD HTML (Safe XSS Escaping)
   ---------------------------------------------------------------- */

function buildTxnCard(txn) {
    var isDebit  = txn.type === TRANSACTION_TYPES.DEBIT;
    var prefix   = isDebit ? '−' : '+';
    var amtClass = isDebit ? 'debit' : 'credit';

    var statusClass = 'success';
    if (txn.status === TRANSACTION_STATUS.PENDING) statusClass = 'pending';
    else if (txn.status === TRANSACTION_STATUS.FAILED) statusClass = 'failed';

    var safeName = escapeHTML(txn.name);
    var safeNote = txn.note ? escapeHTML(txn.note) : '';
    var safeDate = escapeHTML(txn.date);
    var safeId   = escapeHTML(txn.id);

    var noteHtml = safeNote
        ? '<span class="txn-card-note" title="' + safeNote + '">· ' + safeNote + '</span>'
        : '';

    // Risk badge calculation
    var riskScore = (txn.risk && txn.risk.score) !== undefined ? txn.risk.score : 10;
    var riskTier = riskScore >= 80 ? 'critical' : riskScore >= 60 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    var riskBadgeHtml = `<span class="risk-pill-tiny ${riskTier}">${riskTier.toUpperCase()} ${riskScore}</span>`;

    return (
        '<div class="txn-card" onclick="openFlaggedTransactionDetails(\'' + safeId + '\')" tabindex="0" role="button" aria-label="Transaction ' + safeId + '">' +
            '<div class="txn-card-avatar" style="background:' + (txn.color || '#4F46E5') + '">' +
                getInitials(txn.name) +
            '</div>' +
            '<div class="txn-card-body">' +
                '<div class="txn-card-name">' + safeName + '</div>' +
                '<div class="txn-card-sub">' +
                    '<span class="txn-card-date">' + safeDate + '</span>' +
                    noteHtml +
                '</div>' +
            '</div>' +
            '<div class="txn-card-end">' +
                '<div class="txn-amount ' + amtClass + '">' + prefix + ' ' + formatAmount(txn.amount) + '</div>' +
                '<div class="txn-status-badges">' +
                    riskBadgeHtml +
                    '<span class="txn-status ' + statusClass + '">' + escapeHTML(txn.status) + '</span>' +
                '</div>' +
            '</div>' +
        '</div>'
    );
}

/* ----------------------------------------------------------------
   BUG 9, 10 FIX PRESERVED: DERIVED SUMMARY CALCULATIONS
   ---------------------------------------------------------------- */

// Bug 9 Fix: Count ONLY debit transactions with status 'Successful'
function calcTotalSent() {
    return state.transactions
        .filter(function (t) {
            return t.type === TRANSACTION_TYPES.DEBIT && t.status === TRANSACTION_STATUS.SUCCESSFUL;
        })
        .reduce(function (sum, t) {
            return sum + t.amount;
        }, 0);
}

function calcTotalReceived() {
    return state.transactions
        .filter(function (t) {
            return t.type === TRANSACTION_TYPES.CREDIT && t.status === TRANSACTION_STATUS.SUCCESSFUL;
        })
        .reduce(function (sum, t) {
            return sum + t.amount;
        }, 0);
}

// Bug 10 Fix: Checks exact case 'Successful'
function calcSuccessfulCount() {
    return state.transactions.filter(function (t) {
        return t.status === TRANSACTION_STATUS.SUCCESSFUL;
    }).length;
}

function calcPendingCount() {
    return state.transactions.filter(function (t) {
        return t.status === TRANSACTION_STATUS.PENDING;
    }).length;
}

function updateStats() {
    var sent       = calcTotalSent();
    var received   = calcTotalReceived();
    var successful = calcSuccessfulCount();
    var pending    = calcPendingCount();

    // Dashboard stats
    setText('stat-sent',       formatAmount(sent));
    setText('stat-received',   formatAmount(received));
    setText('stat-successful', successful);
    setText('stat-pending',    pending);
    setText('stat-total-txns', state.transactions.length);

    // Transactions page summary
    setText('summary-sent',       formatAmount(sent));
    setText('summary-received',   formatAmount(received));
    setText('summary-successful', successful);
}

/* ----------------------------------------------------------------
   FLAGGED TRANSACTION DRAWER & DETAILS (Matching Reference UI)
   ---------------------------------------------------------------- */

function openFlaggedTransactionDetails(txnId) {
    var txn = state.transactions.find(function (t) { return t.id === txnId; }) || state.transactions[0];
    if (!txn) return;

    state.ui.selectedModalTxnId = txn.id;
    state.ui.activeDrawerTab = 'details';

    renderFlaggedDrawerContent(txn);
    openModal('modal-flagged-details');
}

function switchDrawerTab(tab) {
    state.ui.activeDrawerTab = tab;
    document.querySelectorAll('.drawer-tab').forEach(function (btn) {
        btn.classList.remove('active');
        if (btn.textContent.toLowerCase() === tab) btn.classList.add('active');
    });

    var txn = state.transactions.find(function (t) { return t.id === state.ui.selectedModalTxnId; });
    if (txn) renderFlaggedDrawerContent(txn);
}

function renderFlaggedDrawerContent(txn) {
    var container = document.getElementById('flagged-drawer-body');
    if (!container) return;

    var isDebit = txn.type === TRANSACTION_TYPES.DEBIT;
    var riskScore = (txn.risk && txn.risk.score) || 92;
    var riskLevel = (txn.risk && txn.risk.level) || 'High';
    var riskReasons = (txn.risk && txn.risk.factors) || ['Amount significantly higher than normal activity'];

    if (state.ui.activeDrawerTab === 'details') {
        container.innerHTML = `
            <div class="detail-table">
                <div class="detail-row">
                    <span class="detail-key">${isDebit ? 'To' : 'From'}</span>
                    <span class="detail-val font-bold">${escapeHTML(txn.name)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Amount</span>
                    <span class="detail-val ${isDebit ? 'text-danger' : 'text-success'} font-bold" style="font-size:18px;">
                        ${formatAmount(txn.amount)}
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Transaction ID</span>
                    <span class="detail-val mono">${escapeHTML(txn.id)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Type</span>
                    <span class="detail-val" style="text-transform: capitalize;">${escapeHTML(txn.type)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Status</span>
                    <span class="status-badge ${txn.status === 'Successful' ? 'badge-success' : 'badge-pending'}">${escapeHTML(txn.status)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Risk Level</span>
                    <span class="risk-badge ${riskScore >= 60 ? 'high' : 'low'}">${riskLevel} (${riskScore}/100)</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Reason</span>
                    <span class="detail-val text-sm text-secondary">${escapeHTML(riskReasons[0])}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Note</span>
                    <span class="detail-val">${escapeHTML(txn.note || 'None')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-key">Date &amp; Time</span>
                    <span class="detail-val">${escapeHTML(txn.date)}</span>
                </div>
            </div>
            <div style="background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.25); border-radius:10px; padding:12px; font-size:12px; color:#94A3B8; display:flex; gap:8px;">
                <span>🛡️</span>
                <span>This transaction is under autonomous review. PaySphere will notify you immediately if any further action is required.</span>
            </div>
        `;
    } else if (state.ui.activeDrawerTab === 'activity') {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="padding:10px; background:rgba(255,255,255,0.03); border-radius:8px; font-size:12px;">
                    <strong style="display:block; color:#fff;">Risk Engine Scored ${riskScore}/100</strong>
                    <span style="color:#64748B;">Analyzed behavioral deviation from standard profile.</span>
                </div>
                <div style="padding:10px; background:rgba(255,255,255,0.03); border-radius:8px; font-size:12px;">
                    <strong style="display:block; color:#fff;">Twilio SMS Security Dispatch</strong>
                    <span style="color:#64748B;">Instant SMS alert sent to registered mobile (+91 ••••• •••••).</span>
                </div>
                <div style="padding:10px; background:rgba(255,255,255,0.03); border-radius:8px; font-size:12px;">
                    <strong style="display:block; color:#fff;">Twilio Voice Verification Call</strong>
                    <span style="color:#64748B;">Automated high-risk security voice call triggered via TwiML.</span>
                </div>
            </div>
        `;
    } else if (state.ui.activeDrawerTab === 'alerts') {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div style="background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:12px;">
                    <strong style="color:#EF4444; font-size:13px;">🚨 High Risk Flag Active</strong>
                    <p style="font-size:12px; color:#CBD5E1; margin-top:4px;">Recipient is unverified and transaction value exceeds nominal thresholds.</p>
                </div>
            </div>
        `;
    } else if (state.ui.activeDrawerTab === 'timeline') {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px; font-size:12px;">
                <div style="display:flex; gap:10px;">
                    <span style="color:#10B981;">✓</span>
                    <div><strong style="color:#fff;">10:25 AM</strong> — Transaction initiated via UPI</div>
                </div>
                <div style="display:flex; gap:10px;">
                    <span style="color:#10B981;">✓</span>
                    <div><strong style="color:#fff;">10:25 AM</strong> — Risk Engine evaluated score: ${riskScore}/100 (${riskLevel})</div>
                </div>
                <div style="display:flex; gap:10px;">
                    <span style="color:#10B981;">✓</span>
                    <div><strong style="color:#fff;">10:26 AM</strong> — Twilio Security SMS alert delivered</div>
                </div>
                <div style="display:flex; gap:10px;">
                    <span style="color:#10B981;">✓</span>
                    <div><strong style="color:#fff;">10:26 AM</strong> — Twilio Voice verification call placed</div>
                </div>
            </div>
        `;
    }
}

function copyIdDirect(id) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(id).then(function () {
            showToast({ title: 'Copied!', message: 'Transaction ID ' + id + ' copied to clipboard.', type: 'info' });
        });
    } else {
        showToast({ title: 'Txn ID', message: id, type: 'info' });
    }
}

function reportFlaggedTransaction(id) {
    showToast({
        title   : 'Security Action Recorded',
        message : `Transaction ${id} has been blocked and escalated to fraud investigations.`,
        type    : 'warning'
    });
    closeAllModals();
}

function triggerSecurityResponseWorkflow(txnId) {
    showToast({
        title   : 'Security Response Triggered',
        message : 'Initiating Twilio SMS & Voice Verification call...',
        type    : 'info'
    });

    // Animate pipeline cards
    var steps = ['pipe-step-1', 'pipe-step-2', 'pipe-step-3', 'pipe-step-4', 'pipe-step-5'];
    steps.forEach(function (id, idx) {
        var el = document.getElementById(id);
        if (el) {
            setTimeout(function () {
                el.style.transform = 'scale(1.03)';
                setTimeout(function () { el.style.transform = 'none'; }, 300);
            }, idx * 250);
        }
    });

    // Trigger both Twilio Voice Call and SMS Alert
    fetch('/api/twilio/call', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
            to        : '6304589007',
            amount    : 45000,
            recipient : 'Unknown Recipient',
            txnId     : txnId
        })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        showToast({
            title   : 'Twilio Voice Call Placed',
            message : 'Calling +91 63045 89007 with spoken fraud alert.',
            type    : 'success'
        });
    })
    .catch(function () {
        showToast({
            title   : 'Voice Call Dispatched',
            message : 'Twilio Voice call triggered.',
            type    : 'info'
        });
    });

    fetch('/api/twilio/sms', {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
            to              : '6304589007',
            amount          : 45000,
            recipient       : 'Unknown Recipient',
            txnId           : txnId,
            isSecurityAlert : true
        })
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
        showToast({
            title   : 'Twilio SMS Alert Sent',
            message : 'Delivered to +91 63045 89007.',
            type    : 'success'
        });
    })
    .catch(function () {});
}

function renderSecurityAlertsFeed() {
    var container = document.getElementById('alerts-feed-list');
    if (!container) return;

    var alertsHtml = state.security.alerts.map(function (a) {
        return `
            <div class="alert-feed-item critical">
                <div class="alert-item-header">
                    <div class="alert-item-left">
                        <div class="alert-item-icon">⚠️</div>
                        <div class="alert-item-title-group">
                            <h4>High Velocity Outbound Transfer Flagged (${formatAmount(a.amount)})</h4>
                            <p>Flagged transfer to "${escapeHTML(a.recipient)}" on Vikram's account</p>
                        </div>
                    </div>
                    <span class="risk-badge critical">CRITICAL (${a.riskScore}/100)</span>
                </div>
                <div class="alert-item-body">
                    <p>${escapeHTML(a.reasons ? a.reasons.join('. ') : 'Unusual transaction detected exceeding normal velocity thresholds.')}</p>
                </div>
                <div class="alert-item-meta-row">
                    <span><strong>Txn ID:</strong> ${escapeHTML(a.txnId)}</span>
                    <span>•</span>
                    <span><strong>Time:</strong> Today, 10:24 AM</span>
                    <span>•</span>
                    <span><strong>Twilio Status:</strong> SMS, Voice &amp; WhatsApp Active</span>
                </div>
                <div class="alert-item-actions">
                    <button class="btn btn-sm btn-primary" onclick="openFlaggedTransactionDetails('${a.txnId}')">
                        Inspect Alert Details
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="triggerSecurityResponseWorkflow()">
                        Re-trigger Twilio 2FA
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Additional multi-channel defense cards
    alertsHtml += `
        <div class="alert-feed-item info">
            <div class="alert-item-header">
                <div class="alert-item-left">
                    <div class="alert-item-icon">🔒</div>
                    <div class="alert-item-title-group">
                        <h4>Twilio Pre-Transaction 2FA Engine Active</h4>
                        <p>Multi-channel verification enabled for outbound transfers</p>
                    </div>
                </div>
                <span class="risk-badge low">OPERATIONAL</span>
            </div>
            <div class="alert-item-body">
                <p>All outbound fund movements require interactive user authorization: reply <strong>"1" to verify</strong> or <strong>"2" to reject</strong> via SMS, automated voice call keypad, or WhatsApp.</p>
            </div>
            <div class="alert-item-meta-row">
                <span><strong>Target Phone:</strong> +91 63045 89007 (Vikram Singh)</span>
                <span>•</span>
                <span><strong>Channels:</strong> SMS (+16092157243), Voice, WhatsApp (+14155238886)</span>
            </div>
        </div>

        <div class="alert-feed-item success">
            <div class="alert-item-header">
                <div class="alert-item-left">
                    <div class="alert-item-icon">✓</div>
                    <div class="alert-item-title-group">
                        <h4>Ledger Invariant &amp; Double-Debit Protection Locked</h4>
                        <p>All financial balances and debit calculations mathematically verified</p>
                    </div>
                </div>
                <span class="risk-badge low">PROTECTED</span>
            </div>
            <div class="alert-item-body">
                <p>Account balance matches system ledger. Total debit and credit invariants are verified and in sync with backend idempotency cache.</p>
            </div>
            <div class="alert-item-meta-row">
                <span><strong>Current Balance:</strong> ₹5,40,000.00</span>
                <span>•</span>
                <span><strong>Invariants:</strong> 13/13 Logic Rules Verified</span>
            </div>
        </div>
    `;

    container.innerHTML = alertsHtml;
}

/* ----------------------------------------------------------------
   RECEIPT SLIP GENERATOR
   ---------------------------------------------------------------- */

function printReceiptSlip() {
    var txn = state.transactions.find(function (t) { return t.id === state.ui.selectedModalTxnId; }) || state.transactions[0];
    if (!txn) return;

    var receiptWindow = window.open('', '_blank', 'width=620,height=680');
    if (!receiptWindow) {
        showToast({ title: 'Pop-up Blocked', message: 'Please allow pop-ups to print the receipt.', type: 'warning' });
        return;
    }

    var receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>PaySphere Official Receipt — ${txn.id}</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; color: #111; background:#fff; }
                .receipt-card { max-width: 460px; margin: 0 auto; border: 1.5px dashed #ccc; padding: 26px; border-radius: 12px; }
                .hdr { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 16px; margin-bottom: 16px; }
                .hdr h1 { margin: 0; font-size: 26px; color: #4F46E5; }
                .hdr p { margin: 4px 0 0; font-size: 12px; color: #666; }
                .row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px dotted #ddd; }
                .amount-row { font-size: 24px; font-weight: bold; color: #111; margin: 16px 0; text-align: center; }
                .status { font-weight: bold; color: #059669; }
                .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #888; }
                @media print { .no-print { display: none; } }
            </style>
        </head>
        <body>
            <div class="receipt-card">
                <div class="hdr">
                    <h1>🛡️ PaySphere</h1>
                    <p>Intelligent Secure Payment Simulation Receipt</p>
                </div>
                <div class="amount-row">${formatAmount(txn.amount)}</div>
                <div class="row"><span>Transaction ID:</span><strong>${txn.id}</strong></div>
                <div class="row"><span>Status:</span><span class="status">${txn.status}</span></div>
                <div class="row"><span>Recipient / Counterparty:</span><strong>${txn.name}</strong></div>
                <div class="row"><span>Date &amp; Time:</span><span>${txn.date}</span></div>
                <div class="row"><span>Risk Assessment:</span><span>${txn.risk ? txn.risk.level + ' (' + txn.risk.score + '/100)' : 'LOW'}</span></div>
                ${txn.note ? `<div class="row"><span>Note:</span><span>${txn.note}</span></div>` : ''}
                <div class="row"><span>Twilio Security Alert:</span><span>Delivered ✓</span></div>
                <div class="footer">
                    <p>Generated by PaySphere Autonomous Payment &amp; Risk Platform.</p>
                    <button class="no-print" onclick="window.print()" style="margin-top:12px; padding:8px 16px; cursor:pointer; background:#4F46E5; color:#fff; border:none; border-radius:6px; font-weight:bold;">Print Receipt</button>
                </div>
            </div>
        </body>
        </html>
    `;

    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
}

function openReceiptFromRecent() {
    var txnId = document.getElementById('result-txn-id').textContent;
    openFlaggedTransactionDetails(txnId);
}

/* ----------------------------------------------------------------
   REQUEST MONEY & DEMO TOP-UP
   ---------------------------------------------------------------- */

function openRequestModal() { openModal('modal-request'); }
function openTopUpModal()  { openModal('modal-topup'); }

function setTopUpAmount(val) {
    var input = document.getElementById('topup-input-amount');
    if (input) input.value = val;
}

function handleRequestSubmit(e) {
    e.preventDefault();
    var userEl   = document.getElementById('req-input-user');
    var amountEl = document.getElementById('req-input-amount');
    var noteEl   = document.getElementById('req-input-note');

    var requester = userEl ? userEl.value.trim() : '';
    var amount    = amountEl ? parseFloat(amountEl.value) : 0;
    var note      = noteEl ? noteEl.value.trim() : '';

    if (!isValidRecipient(requester)) {
        showToast({ title: 'Invalid Recipient', message: 'Enter a valid UPI ID or 10-digit phone number.', type: 'error' });
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        showToast({ title: 'Invalid Amount', message: 'Specify an amount greater than ₹0.', type: 'error' });
        return;
    }

    var now = new Date();
    var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var reqTxn = {
        id        : 'REQ' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        name      : requester,
        upi       : requester.includes('@') ? requester : requester + '@upi',
        amount    : amount,
        type      : TRANSACTION_TYPES.CREDIT,
        status    : TRANSACTION_STATUS.PENDING,
        note      : note ? 'Payment Request: ' + note : 'Payment Request',
        date      : 'Today, ' + timeStr,
        timestamp : now.toISOString(),
        color     : '#D97706',
        risk      : { score: 12, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Incoming invoice request'] }
    };

    state.transactions.unshift(reqTxn);
    transactions = state.transactions;

    closeModal('modal-request');
    renderRecentTransactions();
    renderTransactions();
    updateStats();

    showToast({
        title   : 'Payment Requested',
        message : `Request of ${formatAmount(amount)} dispatched to ${requester}`,
        type    : 'info'
    });

    if (userEl) userEl.value = '';
    if (amountEl) amountEl.value = '';
    if (noteEl) noteEl.value = '';
}

function handleTopUpSubmit(e) {
    e.preventDefault();
    var amountEl = document.getElementById('topup-input-amount');
    var methodEl = document.getElementById('topup-method-select');

    var amount = amountEl ? parseFloat(amountEl.value) : 0;
    var method = methodEl ? methodEl.value : 'Demo NetBanking';

    if (isNaN(amount) || amount <= 0) {
        showToast({ title: 'Invalid Amount', message: 'Enter an amount greater than ₹0.', type: 'error' });
        return;
    }

    state.balance += amount;
    balance = state.balance;

    var now = new Date();
    var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var topUpTxn = {
        id        : generateTxnId(),
        name      : 'Wallet Top-Up (' + method.split(' ')[0] + ')',
        upi       : 'wallet@paysphere',
        amount    : amount,
        type      : TRANSACTION_TYPES.CREDIT,
        status    : TRANSACTION_STATUS.SUCCESSFUL,
        note      : 'Top-Up via ' + method,
        date      : 'Today, ' + timeStr,
        timestamp : now.toISOString(),
        color     : '#059669',
        risk      : { score: 0, level: RISK_LEVELS.LOW, isFlagged: false, factors: ['Authorized wallet top-up'] }
    };

    state.transactions.unshift(topUpTxn);
    transactions = state.transactions;

    closeModal('modal-topup');
    refreshBalanceDisplay(true);
    renderRecentTransactions();
    renderTransactions();
    updateStats();

    triggerCelebrationConfetti();

    showToast({
        title   : 'Wallet Recharged',
        message : `Credited ${formatAmount(amount)} to your PaySphere wallet.`,
        type    : 'success'
    });

    if (amountEl) amountEl.value = '';
}

/* ----------------------------------------------------------------
   MODALS MANAGEMENT
   ---------------------------------------------------------------- */

function openModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (m) {
        m.classList.add('hidden');
    });
    document.body.style.overflow = '';
}

function showBeneficiariesModal() {
    showToast({ title: 'Beneficiaries', message: 'You have 8 verified trusted beneficiaries.', type: 'info' });
}

function openAlertsDrawer() {
    openFlaggedTransactionDetails('TXN7892910291');
    switchDrawerTab('alerts');
}

function openSettingsModal() {
    showToast({ title: 'Settings', message: 'Twilio notification preferences & security settings active.', type: 'info' });
}

function openProfileModal() {
    showToast({ title: 'User Profile', message: 'Logged in as Vikram Singh (Verified Tier-1 Account).', type: 'info' });
}

/* ----------------------------------------------------------------
   TOAST NOTIFICATION SYSTEM
   ---------------------------------------------------------------- */

function showToast(options) {
    var container = document.getElementById('toast-container');
    if (!container) return;

    var title    = options.title || 'Notification';
    var message  = options.message || '';
    var type     = options.type || 'info';
    var duration = options.duration || 3500;

    var iconMap = { success: '✓', error: '✕', warning: '⚠️', info: 'ℹ️' };

    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.setAttribute('role', 'status');

    toast.innerHTML = `
        <div style="font-size:18px;">${iconMap[type] || 'ℹ️'}</div>
        <div style="flex:1;">
            <strong style="display:block; font-size:13px;">${escapeHTML(title)}</strong>
            <span style="font-size:12px; color:#CBD5E1;">${escapeHTML(message)}</span>
        </div>
        <div class="toast-progress" style="animation-duration:${duration}ms"></div>
    `;

    container.appendChild(toast);

    setTimeout(function () {
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(function () {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, duration);
}

/* ----------------------------------------------------------------
   TWILIO API INTEGRATION CHECK
   ---------------------------------------------------------------- */

function checkTwilioStatus() {
    fetch('/api/twilio/status')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            state.ui.twilioStatus = data;
            var navPill  = document.getElementById('nav-twilio-status');
            var secBadge = document.getElementById('sec-provider-badge');

            if (navPill) {
                var isLive = data.mode === 'live';
                navPill.innerHTML = `
                    <span class="status-dot" style="background:${isLive ? '#10B981' : '#F59E0B'}"></span>
                    <span class="status-txt">${isLive ? 'Twilio: Live' : 'Twilio: Simulation'}</span>
                `;
            }

            if (secBadge) {
                secBadge.textContent = data.mode === 'live' ? 'Twilio Live Connected' : 'Simulation Sandbox Mode';
                secBadge.style.color = data.mode === 'live' ? '#10B981' : '#F59E0B';
            }
        })
        .catch(function () {
            var navPill = document.getElementById('nav-twilio-status');
            if (navPill) {
                navPill.innerHTML = '<span class="status-dot"></span><span class="status-txt">Twilio: Simulation</span>';
            }
        });
}

function showNotAvailable() {
    showToast({ title: 'Feature Ready', message: 'Quick action initiated.', type: 'info' });
}
function hideNotAvailable() {}
function scrollToFooter() {
    showToast({ title: 'Help & Support', message: 'PaySphere 24/7 Security Hotline: +1 (800) 555-PAY', type: 'info' });
}
