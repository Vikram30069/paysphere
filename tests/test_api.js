/**
 * API & Idempotency Integration Tests for PayFlow Server
 */

const assert = require('assert');
const { paymentService, TRANSACTION_TYPES, TRANSACTION_STATUS } = require('../services/paymentService');

async function runApiTests() {
    console.log('--- RUNNING PAYFLOW API & SERVICE TESTS ---');

    // 1. Initial State
    const balanceData = paymentService.getBalance();
    const initialBal = balanceData.balance;
    assert.strictEqual(initialBal, 540000.00, 'Initial balance should be 540000.00');

    // 2. Successful Payment with Idempotency
    const idempotencyKey = 'IDEMPOTENCY_TEST_KEY_001';
    const paymentPayload = {
        recipient: 'priya.sharma@upi',
        amount: 1500.00,
        note: 'Consultation Advance',
        idempotencyKey,
        notifySMS: true,
        phone: '9876543210'
    };

    const res1 = await paymentService.processPayment(paymentPayload);
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.transaction.status, 'Successful');
    assert.strictEqual(res1.transaction.amount, 1500.00);
    assert.strictEqual(res1.balance, initialBal - 1500.00);
    console.log('✔ Payment processing & balance deduction verified.');

    // 3. Test Idempotency (Repeat exact request)
    const res2 = await paymentService.processPayment(paymentPayload);
    assert.strictEqual(res2.isDuplicate, true, 'Submitting duplicate idempotency key must be flagged');
    assert.strictEqual(res2.balance, initialBal - 1500.00, 'Duplicate submission must NOT deduct balance again');
    console.log('✔ Idempotency protection verified (duplicate blocked).');

    // 4. Test Insufficient Balance Rejection
    try {
        await paymentService.processPayment({
            recipient: 'rahul@upi',
            amount: 999999.00,
            note: 'Overdraft test'
        });
        assert.fail('Should have thrown INSUFFICIENT_BALANCE');
    } catch (err) {
        assert.strictEqual(err.code, 'INSUFFICIENT_BALANCE');
        console.log('✔ Insufficient balance rejection verified.');
    }

    // 5. Test Demo Top-Up (Add Money)
    const topUpRes = paymentService.addMoney({ amount: 2000, method: 'UPI NetBanking' });
    assert.strictEqual(topUpRes.success, true);
    assert.strictEqual(topUpRes.balance, initialBal - 1500.00 + 2000.00);
    assert.strictEqual(topUpRes.transaction.type, TRANSACTION_TYPES.CREDIT);
    console.log('✔ Demo Top-Up (Add Money) verified.');

    // 6. Test Request Money
    const reqRes = paymentService.requestMoney({ requester: 'kavita@upi', amount: 800, note: 'Dinner split' });
    assert.strictEqual(reqRes.success, true);
    assert.strictEqual(reqRes.request.status, TRANSACTION_STATUS.PENDING);
    console.log('✔ Request Money workflow verified.');

    console.log('\n========================================');
    console.log('🎉 ALL API & SERVICE INTEGRATION TESTS PASSED!');
    console.log('========================================');
}

runApiTests().catch(err => {
    console.error('❌ API Test Failed:', err);
    process.exit(1);
});
