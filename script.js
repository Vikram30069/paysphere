/* ================================================================
   PAYFLOW — SCRIPT.JS
   Application Logic, State Management & DOM Rendering
   ================================================================ */

'use strict';

/* ----------------------------------------------------------------
   APPLICATION STATE
   ---------------------------------------------------------------- */

let balance = 24580.00;

let paymentData = {
    recipient : '',
    amount    : '',
    note      : ''
};

let activeFilter = 'all';
let searchQuery  = '';

/* ----------------------------------------------------------------
   TRANSACTION DATA
   ---------------------------------------------------------------- */

const transactions = [
    {
        id     : 'TXNA1B2C3',
        name   : 'Rahul Kumar',
        upi    : 'rahul@payflow',
        amount : 1200,
        type   : 'debit',
        status : 'Successful',
        note   : 'Lunch split',
        date   : 'Today, 10:45 AM',
        color  : '#4F46E5'
    },
    {
        id     : 'TXND4E5F6',
        name   : 'Priya Sharma',
        upi    : 'priya@upi',
        amount : 3500,
        type   : 'credit',
        status : 'Successful',
        note   : 'Salary advance',
        date   : 'Yesterday, 6:20 PM',
        color  : '#059669'
    },
    {
        id     : 'TXNG7H8I9',
        name   : 'Vikram Singh',
        upi    : '9876543210@ybl',
        amount : 850,
        type   : 'debit',
        status : 'Pending',
        note   : 'Movie tickets',
        date   : 'Yesterday, 2:10 PM',
        color  : '#D97706'
    },
    {
        id     : 'TXNJ0K1L2',
        name   : 'Meera Patel',
        upi    : 'meera.patel@okaxis',
        amount : 5000,
        type   : 'credit',
        status : 'Successful',
        note   : 'Rent share',
        date   : '29 Aug, 11:00 AM',
        color  : '#7C3AED'
    },
    {
        id     : 'TXNM3N4O5',
        name   : 'Amazon Pay',
        upi    : 'amazon@apl',
        amount : 2349,
        type   : 'debit',
        status : 'Failed',
        note   : 'Order #AMZ-9812',
        date   : '28 Aug, 9:30 AM',
        color  : '#DC2626'
    },
    {
        id     : 'TXNP6Q7R8',
        name   : 'Ananya Roy',
        upi    : 'ananya@paytm',
        amount : 750,
        type   : 'debit',
        status : 'Successful',
        note   : 'Coffee',
        date   : '27 Aug, 4:15 PM',
        color  : '#EC4899'
    },
    {
        id     : 'TXNS9T0U1',
        name   : 'Deepak Menon',
        upi    : 'deepak@phonepe',
        amount : 12000,
        type   : 'credit',
        status : 'Successful',
        note   : 'Freelance payment',
        date   : '26 Aug, 1:00 PM',
        color  : '#0EA5E9'
    },
    {
        id     : 'TXNV2W3X4',
        name   : 'Swiggy',
        upi    : 'swiggy@upi',
        amount : 420,
        type   : 'debit',
        status : 'Pending',
        note   : 'Food order',
        date   : '25 Aug, 8:00 PM',
        color  : '#F97316'
    }
];

/* ----------------------------------------------------------------
   UTILITIES
   ---------------------------------------------------------------- */

function generateTxnId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'TXN';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

function formatAmount(value) {
    return '₹' + parseFloat(value).toLocaleString('en-IN', {
        minimumFractionDigits : 2,
        maximumFractionDigits : 2
    });
}

function getInitials(name) {
    return name.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(function (w) { return w[0]; })
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
    setCurrentDate();
    refreshBalanceDisplay();
    renderRecentTransactions();
    updateStats();
});

function setCurrentDate() {
    var el = document.getElementById('current-date');
    if (!el) return;
    var now = new Date();
    el.textContent = now.toLocaleDateString('en-IN', {
        weekday : 'long',
        day     : 'numeric',
        month   : 'long',
        year    : 'numeric'
    });
}

/* ----------------------------------------------------------------
   BALANCE DISPLAY
   ---------------------------------------------------------------- */

function refreshBalanceDisplay() {
    var formatted = balance.toLocaleString('en-IN', {
        minimumFractionDigits : 2,
        maximumFractionDigits : 2
    });
    setText('balance-display',    formatted);
    setText('form-balance-hint',  '₹' + formatted);
}

/* ----------------------------------------------------------------
   NAVIGATION
   ---------------------------------------------------------------- */

function showSection(key) {
    var sections = {
        dashboard    : 'section-dashboard',
        send         : 'section-send',
        transactions : 'section-transactions'
    };
    var navIds = {
        dashboard    : 'nav-home',
        send         : 'nav-send',
        transactions : 'nav-transactions'
    };

    document.querySelectorAll('.section').forEach(function (s) {
        s.classList.remove('active');
    });
    document.querySelectorAll('.nav-link').forEach(function (l) {
        l.classList.remove('active');
    });

    var section = document.getElementById(sections[key]);
    var navLink = document.getElementById(navIds[key]);

    if (section) section.classList.add('active');
    if (navLink) navLink.classList.add('active');

    closeMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (key === 'transactions') {
        updateStats();
        renderTransactions();
    }
}

function scrollToFooter() {
    var footer = document.getElementById('site-footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    closeMenu();
}

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('open');
}

function closeMenu() {
    var links = document.getElementById('nav-links');
    if (links) links.classList.remove('open');
}

/* ----------------------------------------------------------------
   NOTICE BAR
   ---------------------------------------------------------------- */

var noticeTimer = null;

function showNotAvailable() {
    var bar = document.getElementById('notice-bar');
    bar.classList.add('show');
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(hideNotAvailable, 3500);
}

function hideNotAvailable() {
    var bar = document.getElementById('notice-bar');
    if (bar) bar.classList.remove('show');
}

/* ----------------------------------------------------------------
   PAYMENT FORM — VIEW SWITCHING
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

/* ----------------------------------------------------------------
   RECIPIENT VALIDATION
   Validates phone numbers (10 digits) and UPI IDs.
   Note: Only alphanumeric characters before @ are accepted.
   ---------------------------------------------------------------- */
function isValidRecipient(value) {
    var phonePattern = /^[0-9]{10}$/;
    var upiPattern   = /^[a-zA-Z0-9]+@[a-zA-Z]+$/;
    return phonePattern.test(value) || upiPattern.test(value);
}

/* ----------------------------------------------------------------
   FORM VALIDATION
   ---------------------------------------------------------------- */

function validateForm() {
    clearErrors();
    var valid = true;

    var recipient = document.getElementById('recipient-input').value.trim();
    var amountRaw = document.getElementById('amount').value.trim();
    var amtNum    = parseFloat(amountRaw);

    if (!recipient) {
        setText('err-recipient', 'Please enter a recipient.');
        valid = false;
    } else if (!isValidRecipient(recipient)) {
        setText('err-recipient', 'Enter a valid UPI ID or 10-digit phone number.');
        valid = false;
    }

    if (!amountRaw) {
        setText('err-amount', 'Please enter an amount.');
        valid = false;
    } else if (isNaN(amtNum) || amtNum <= 0) {
        setText('err-amount', 'Amount must be greater than ₹0.');
        valid = false;
    } else if (amtNum > balance) {
        setText('err-amount', 'Amount exceeds your available balance.');
        valid = false;
    }

    return valid;
}

/* ----------------------------------------------------------------
   HANDLE CONTINUE — form → review
   ---------------------------------------------------------------- */

function handleContinue() {
    if (!validateForm()) return;

    paymentData.recipient = document.getElementById('recipient-input').value.trim();
    paymentData.amount    = document.getElementById('amount').value.trim();
    paymentData.note      = document.getElementById('payment-note').value.trim();

    document.getElementById('review-recipient').textContent = paymentData.recipient;
    document.getElementById('review-amount').textContent    = formatAmount(paymentData.amount);

    var noteRow = document.getElementById('review-note-row');
    if (paymentData.note) {
        document.getElementById('review-note').textContent = paymentData.note;
        noteRow.classList.remove('hidden');
    } else {
        noteRow.classList.add('hidden');
    }

    switchView('view-review');
}

/* ----------------------------------------------------------------
   HANDLE EDIT — review → form
   Restores recipient and amount fields from saved payment data.
   ---------------------------------------------------------------- */
function handleEdit() {
    document.getElementById('recipient-input').value = paymentData.recipient;
    document.getElementById('amount').value          = paymentData.amount;
    // Note field restoration is missing here

    clearErrors();
    switchView('view-form');
}

/* ----------------------------------------------------------------
   HANDLE CONFIRM — triggers payment processing with loading state
   ---------------------------------------------------------------- */

function handleConfirm() {
    var btn      = document.getElementById('confirm-btn');
    btn.textContent = 'Processing…';
    btn.disabled    = true;

    setTimeout(function () {
        processPayment();
        btn.textContent = 'Confirm Payment';
        btn.disabled    = false;
    }, 1500);
}

/* ----------------------------------------------------------------
   PROCESS PAYMENT — deducts balance, creates transaction record
   ---------------------------------------------------------------- */

function processPayment() {
    var amount = parseFloat(paymentData.amount);

    // Refresh the displayed balance before updating the internal value
    refreshBalanceDisplay();
    balance -= amount;

    var txnId   = generateTxnId();
    var now     = new Date();
    var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    var dateStr = 'Today, ' + timeStr;

    var newTxn = {
        id     : txnId,
        name   : paymentData.recipient,
        upi    : paymentData.recipient,
        amount : amount,
        type   : 'debit',
        status : 'Success',
        note   : paymentData.note,
        date   : dateStr,
        color  : '#4F46E5'
    };

    transactions.unshift(newTxn);

    // Populate result screen
    setText('result-subtext',    formatAmount(amount) + ' sent successfully');
    setText('result-recipient',  paymentData.recipient);
    setText('result-amount',     formatAmount(amount));
    setText('result-txn-id',     txnId);
    setText('result-date',       dateStr);

    switchView('view-result');
}

/* ----------------------------------------------------------------
   HANDLE DONE — clears state, returns to dashboard
   ---------------------------------------------------------------- */

function handleDone() {
    paymentData = { recipient: '', amount: '', note: '' };

    document.getElementById('recipient-input').value = '';
    document.getElementById('amount').value          = '';
    document.getElementById('payment-note').value    = '';

    showSection('dashboard');
    updateStats();
    renderRecentTransactions();
}

/* ----------------------------------------------------------------
   RENDERING — TRANSACTIONS
   ---------------------------------------------------------------- */

function renderTransactions() {
    var list       = document.getElementById('txn-list');
    var emptyState = document.getElementById('empty-state');
    if (!list || !emptyState) return;

    var filtered = getFiltered();

    if (filtered.length === 0) {
        list.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        list.innerHTML = filtered.map(buildTxnCard).join('');
    }
}

function renderRecentTransactions() {
    var container = document.getElementById('recent-txn-list');
    if (!container) return;
    var recent = transactions.slice(0, 4);
    container.innerHTML = recent.map(buildTxnCard).join('');
}

/* ----------------------------------------------------------------
   FILTERING & SEARCH
   ---------------------------------------------------------------- */

function getFiltered() {
    var result = transactions.slice();

    switch (activeFilter) {
        case 'sent':
            result = result.filter(function (t) { return t.type === 'debit'; });
            break;
        case 'received':
            result = result.filter(function (t) { return t.type === 'received'; });
            break;
        case 'pending':
            result = result.filter(function (t) { return t.status === 'Pending'; });
            break;
        case 'failed':
            result = result.filter(function (t) { return t.status === 'Failed'; });
            break;
        default:
            break;
    }

    if (searchQuery) {
        result = result.filter(function (t) {
            return t.name.includes(searchQuery);
        });
    }

    return result;
}

function applyFilter(filter) {
    activeFilter = filter;
    document.querySelectorAll('.filter-pill').forEach(function (btn) {
        btn.classList.remove('active');
    });
    var activeBtn = document.querySelector('[data-filter="' + filter + '"]');
    if (activeBtn) activeBtn.classList.add('active');
    renderTransactions();
}

function handleSearch() {
    var input   = document.getElementById('search-input');
    searchQuery = input.value.trim().toLowerCase();
    renderTransactions();
}

/* ----------------------------------------------------------------
   BUILD TRANSACTION CARD HTML
   ---------------------------------------------------------------- */

function buildTxnCard(txn) {
    var isDebit    = txn.type === 'debit';
    var prefix     = isDebit ? '−' : '+';
    var amtClass   = isDebit ? 'debit' : 'credit';

    var statusClass = 'success';
    if (txn.status === 'Pending') statusClass = 'pending';
    else if (txn.status === 'Failed') statusClass = 'failed';

    var noteHtml = txn.note
        ? '<span class="txn-card-note">· ' + txn.note + '</span>'
        : '';

    return (
        '<div class="txn-card">' +
            '<div class="txn-card-avatar" style="background:' + txn.color + '">' +
                getInitials(txn.name) +
            '</div>' +
            '<div class="txn-card-body">' +
                '<div class="txn-card-name">' + txn.name + '</div>' +
                '<div class="txn-card-sub">' +
                    '<span class="txn-card-date">' + txn.date + '</span>' +
                    noteHtml +
                '</div>' +
            '</div>' +
            '<div class="txn-card-end">' +
                '<div class="txn-amount ' + amtClass + '">' + prefix + ' ' + formatAmount(txn.amount) + '</div>' +
                '<span class="txn-status ' + statusClass + '">' + txn.status + '</span>' +
            '</div>' +
        '</div>'
    );
}

/* ----------------------------------------------------------------
   PAYMENT SUMMARY CALCULATIONS
   ---------------------------------------------------------------- */

function calcTotalSent() {
    return transactions.reduce(function (sum, t) {
        return sum + t.amount;
    }, 0);
}

function calcTotalReceived() {
    return transactions
        .filter(function (t) { return t.type === 'credit' && t.status === 'Successful'; })
        .reduce(function (sum, t) { return sum + t.amount; }, 0);
}

function calcSuccessfulCount() {
    return transactions.filter(function (t) {
        return t.status === 'success';
    }).length;
}

function calcPendingCount() {
    return transactions.filter(function (t) {
        return t.status === 'Pending';
    }).length;
}

function updateStats() {
    var sent        = calcTotalSent();
    var received    = calcTotalReceived();
    var successful  = calcSuccessfulCount();
    var pending     = calcPendingCount();

    // Dashboard stats
    setText('stat-sent',       formatAmount(sent));
    setText('stat-received',   formatAmount(received));
    setText('stat-successful', successful);
    setText('stat-pending',    pending);

    // Transactions page summary
    setText('summary-sent',       formatAmount(sent));
    setText('summary-received',   formatAmount(received));
    setText('summary-successful', successful);
}
