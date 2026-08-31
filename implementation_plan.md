# PayFlow — Implementation Plan

## Project Structure
```
/index.html     — Single-page application shell
/style.css      — Full design system and component styles
/script.js      — All application logic, state, rendering
```

## Intentional Bugs (13 total — distributed across all three files)

### JavaScript Bugs (10)
| # | Location | Bug | Effect |
|---|----------|-----|--------|
| 1 | `isValidRecipient()` | UPI regex `^[a-zA-Z0-9]+@[a-zA-Z]+$` too strict — rejects valid IDs with dots/underscores like `priya.sharma@upi` | Form incorrectly rejects valid inputs |
| 2 | `handleEdit()` | Note field not repopulated from `paymentData` | Note disappears when user edits payment |
| 3 | `processPayment()` | `refreshBalanceDisplay()` called BEFORE `balance -= amount` | Balance display never updates after payment |
| 4 | `processPayment()` | New transaction uses `status: 'Success'` instead of `'Successful'` | Status badge & calculations break for new transactions |
| 5 | `processPayment()` | `renderTransactions()` and `renderRecentTransactions()` not called after payment | History doesn't update until user navigates away |
| 6 | `renderTransactions()` | `emptyState.classList.add('hidden')` not called when results exist | Empty state persists after results appear |
| 7 | `getFiltered()` | Received filter checks `t.type === 'received'` instead of `t.type === 'credit'` | Received filter always returns empty list |
| 8 | `getFiltered()` | Search checks `t.name.includes(searchQuery)` without `.toLowerCase()` on name | Search is case-sensitive; "rahul" finds nothing |
| 9 | `calcTotalSent()` | Sums ALL transaction amounts without filtering by type | Total Sent is grossly inflated |
| 10 | `calcSuccessfulCount()` | Checks `t.status === 'success'` (lowercase) instead of `'Successful'` | Successful count always shows 0 |

### CSS Bugs (2)
| # | Location | Bug | Effect |
|---|----------|-----|--------|
| 11 | `#amount` input | `width: 110%` | Amount field overflows its container |
| 12 | `@media (max-width: 480px)` | `.balance-card { flex-direction: row }` | Balance card layout breaks on small phones |

### HTML Bugs (1)
| # | Location | Bug | Effect |
|---|----------|-----|--------|
| 13 | Note field label | `<label for="note-field">` but input has `id="payment-note"` | Clicking label doesn't focus the input (accessibility issue) |
