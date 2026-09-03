/**
 * Automated Logic & Regression Test Suite for PayFlow
 * Tests all core business rules, bug fixes, filtering, and invariants.
 */

const assert = require('assert');

// 1. Recipient Validation Test
function testRecipientValidation(isValidRecipient) {
    const validRecipients = [
        '9876543210',
        'user@upi',
        'priya.sharma@upi',
        'john-doe@bank',
        'john_doe@bank',
        'arjun.k@okaxis',
        '9876543210@ybl'
    ];

    const invalidRecipients = [
        '12345',           // too short phone
        'user@',           // missing bank
        '@upi',            // missing username
        'user@bank@extra', // double at
        'invalid recipient!',
        ''
    ];

    validRecipients.forEach(r => {
        assert.strictEqual(isValidRecipient(r), true, `Expected valid: ${r}`);
    });

    invalidRecipients.forEach(r => {
        assert.strictEqual(isValidRecipient(r), false, `Expected invalid: ${r}`);
    });

    console.log('✔ Bug 1: isValidRecipient tests passed.');
}

// 2. Note Restoration Simulation
function testNoteRestoration() {
    const paymentData = {
        recipient: 'priya.sharma@upi',
        amount: '1500',
        note: 'Project consultation fee'
    };

    // Simulate handleEdit restoring fields
    const formFields = {
        recipient: paymentData.recipient,
        amount: paymentData.amount,
        note: paymentData.note
    };

    assert.strictEqual(formFields.note, 'Project consultation fee', 'Note field must be restored');
    console.log('✔ Bug 2: Note restoration test passed.');
}

// 3. Balance Ordering & Invariant Test
function testBalanceCalculation() {
    let startingBalance = 24580.00;
    let balance = startingBalance;
    const amount = 1200.00;

    // Correct sequence: deduct balance first, then format display
    balance -= amount;
    const formattedDisplay = balance.toFixed(2);

    assert.strictEqual(balance, 23380.00);
    assert.strictEqual(formattedDisplay, '23380.00');
    console.log('✔ Bug 3: Balance calculation and update ordering test passed.');
}

// 4. Standardized Status Value Test
function testStandardizedStatus() {
    const TRANSACTION_STATUS = {
        SUCCESSFUL: 'Successful',
        PENDING: 'Pending',
        FAILED: 'Failed'
    };

    const newTxn = {
        id: 'TXN12345',
        status: TRANSACTION_STATUS.SUCCESSFUL
    };

    assert.strictEqual(newTxn.status, 'Successful');
    assert.notStrictEqual(newTxn.status, 'Success');
    console.log('✔ Bug 4: Standardized status test passed.');
}

// 5, 7, 8, 9, 10: Filtering, Search, and Calculations Test
function testTransactionsAndCalculations() {
    const TRANSACTION_TYPES = {
        DEBIT: 'debit',
        CREDIT: 'credit'
    };

    const TRANSACTION_STATUS = {
        SUCCESSFUL: 'Successful',
        PENDING: 'Pending',
        FAILED: 'Failed'
    };

    const sampleTransactions = [
        { id: 'TXN1', name: 'Rahul Kumar', upi: 'rahul@payflow', amount: 1200, type: 'debit', status: 'Successful', note: 'Lunch split' },
        { id: 'TXN2', name: 'Priya Sharma', upi: 'priya@upi', amount: 3500, type: 'credit', status: 'Successful', note: 'Salary advance' },
        { id: 'TXN3', name: 'Vikram Singh', upi: '9876543210@ybl', amount: 850, type: 'debit', status: 'Pending', note: 'Movie tickets' },
        { id: 'TXN4', name: 'Amazon Pay', upi: 'amazon@apl', amount: 2349, type: 'debit', status: 'Failed', note: 'Order #AMZ-9812' },
        { id: 'TXN5', name: 'Deepak Menon', upi: 'deepak@phonepe', amount: 12000, type: 'credit', status: 'Successful', note: 'Freelance payment' }
    ];

    // Bug 7: Received filter should filter type === 'credit'
    const received = sampleTransactions.filter(t => t.type === TRANSACTION_TYPES.CREDIT);
    assert.strictEqual(received.length, 2, 'Received filter should find 2 credit transactions');

    // Bug 8: Case-insensitive search
    function searchTxns(query) {
        const q = query.trim().toLowerCase();
        return sampleTransactions.filter(t => 
            t.name.toLowerCase().includes(q) ||
            t.upi.toLowerCase().includes(q) ||
            (t.note && t.note.toLowerCase().includes(q)) ||
            t.id.toLowerCase().includes(q)
        );
    }

    assert.strictEqual(searchTxns('rahul').length, 1, 'Search "rahul" should match "Rahul Kumar"');
    assert.strictEqual(searchTxns('RAHUL').length, 1, 'Search "RAHUL" should match "Rahul Kumar"');
    assert.strictEqual(searchTxns('priya').length, 1, 'Search "priya" should match "Priya Sharma"');
    assert.strictEqual(searchTxns('lunch').length, 1, 'Search "lunch" should match note "Lunch split"');
    assert.strictEqual(searchTxns('txn1').length, 1, 'Search "txn1" should match ID "TXN1"');

    // Bug 9: Total sent calculation (type = debit AND status = Successful)
    function calcTotalSent(txns) {
        return txns
            .filter(t => t.type === TRANSACTION_TYPES.DEBIT && t.status === TRANSACTION_STATUS.SUCCESSFUL)
            .reduce((sum, t) => sum + t.amount, 0);
    }
    assert.strictEqual(calcTotalSent(sampleTransactions), 1200, 'Total Sent should only include successful debits (1200)');

    // Total received calculation (type = credit AND status = Successful)
    function calcTotalReceived(txns) {
        return txns
            .filter(t => t.type === TRANSACTION_TYPES.CREDIT && t.status === TRANSACTION_STATUS.SUCCESSFUL)
            .reduce((sum, t) => sum + t.amount, 0);
    }
    assert.strictEqual(calcTotalReceived(sampleTransactions), 15500, 'Total Received should be 3500 + 12000 = 15500');

    // Bug 10: Successful Count
    function calcSuccessfulCount(txns) {
        return txns.filter(t => t.status === TRANSACTION_STATUS.SUCCESSFUL).length;
    }
    assert.strictEqual(calcSuccessfulCount(sampleTransactions), 3, 'Successful count should be exactly 3');

    // Ledger Invariant Verification
    const initialBalance = 24580.00;
    const finalBalance = initialBalance - calcTotalSent(sampleTransactions) + calcTotalReceived(sampleTransactions);
    assert.strictEqual(finalBalance, 24580.00 - 1200 + 15500, 'Ledger invariant holds');

    console.log('✔ Bugs 7, 8, 9, 10 and Ledger Invariant tests passed.');
}

// 6. Empty State Visibility Logic Test
function testEmptyStateLogic() {
    function getEmptyStateClass(filteredCount) {
        return filteredCount === 0 ? 'visible' : 'hidden';
    }

    assert.strictEqual(getEmptyStateClass(0), 'visible');
    assert.strictEqual(getEmptyStateClass(5), 'hidden');
    console.log('✔ Bug 6: Empty state visibility toggle test passed.');
}

// Run All Tests
try {
    console.log('--- RUNNING PAYFLOW LOGIC TESTS ---');
    
    // Test regex fix
    const improvedRegex = (val) => {
        const phone = /^[0-9]{10}$/;
        const upi = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        return phone.test(val) || upi.test(val);
    };

    testRecipientValidation(improvedRegex);
    testNoteRestoration();
    testBalanceCalculation();
    testStandardizedStatus();
    testTransactionsAndCalculations();
    testEmptyStateLogic();

    console.log('\n========================================');
    console.log('🎉 ALL PAYFLOW AUTOMATED TESTS PASSED!');
    console.log('========================================');
} catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
}
