# Slice UPI-CC Churn Analysis + PRD

**Small merchants reject UPI-linked credit card payments to avoid MDR fees — and 63% of affected users abandon the app within 5 minutes.** This project uses MySQL, Python, and SQL window functions to quantify the churn impact of `MERCHANT_CC_REJECTED` failures, and delivers a Product Requirements Document for a Smart Fallback UI that can cut that churn rate in half.

Built with: MySQL 8.0 · Python 3 · Faker · Raw SQL (aggregation + window functions)

---

## Quick Start

```bash
# 1. Create database & tables
mysql -u root -p < schema/schema.sql

# 2. Install dependencies
pip install faker pymysql

# 3. Generate 10,000 synthetic transactions
python data_generation/generate_transactions.py

# 4. Run analysis
mysql -u root -p slice_upi_analytics < analysis/01_base_funnel_analysis.sql
mysql -u root -p slice_upi_analytics < analysis/02_next_action_churn.sql
```

> **Note:** Update MySQL credentials in `generate_transactions.py` before running.

---

## Project Structure

```
Slice-UPI-Analytics-PRD/
├── README.md                              # This file
├── report.md                              # Full project report
├── schema/
│   └── schema.sql                         # MySQL schema (Users + Transactions)
├── data_generation/
│   └── generate_transactions.py           # Synthetic data generator
├── analysis/
│   ├── 01_base_funnel_analysis.sql        # Transaction status funnel
│   └── 02_next_action_churn.sql           # Window function churn analysis
├── prd/
│   └── Slice_UPI_Fallback_PRD.md          # Product Requirements Document
└── assets/
    └── sql_findings_screenshot.png        # Query results screenshot
```

---

## The Problem

UPI-linked credit card (Slice CC) transactions are growing fast, but small merchants — particularly kirana stores and local retailers — reject these payments to avoid the ~1.5–2% Merchant Discount Rate (MDR) fee. The user sees a generic "Transaction Failed" screen with no explanation and no fallback option.

**Result:** A 62.8% session churn rate after MDR rejections — the worst churn rate of any transaction failure type.

---

## Key Findings

### Transaction Status Funnel

| Status | Volume | % of Total |
|---|---|---|
| SUCCESS | 8,373 | 83.73% |
| INSUFFICIENT_BALANCE | 502 | 5.02% |
| TIMEOUT | 465 | 4.65% |
| NETWORK_ERROR | 453 | 4.53% |
| **MERCHANT_CC_REJECTED** | **207** | **2.07%** |

### Post-Rejection Churn Analysis

Using `LEAD()` window functions to track user behavior within 5 minutes of an MDR rejection:

| Outcome | Count | % |
|---|---|---|
| **Churned** (abandoned session) | 130 | 62.8% |
| **Retained** (retried via Slice Savings) | 77 | 37.2% |

> **"When users face an MDR rejection, 62.8% abandon the app entirely within a 5-minute window."**

---

## Product Requirements Document: Smart Fallback UI

### Problem Statement

UPI-CC is scaling, but MDR avoidance by small merchants causes a ~63% session churn rate when transactions are rejected. Users see a generic error with no context about *why* their payment failed and no guidance on how to complete their purchase.

### Data Evidence

- **2.07%** of all transactions are `MERCHANT_CC_REJECTED`
- **62.8%** of affected users churn within 5 minutes
- Only **37.2%** organically discover the Slice Savings workaround — with zero UI guidance
- All MDR rejections occur on **high-value transactions (> ₹2,000)** at kirana/retail merchants — Slice's core use case

### Proposed Solution: Smart Fallback UI

When the backend returns `MERCHANT_CC_REJECTED`, **do not show a generic error.** Instead, trigger a **bottom-sheet overlay**:

> **"Credit Card blocked by merchant"**  
> This merchant doesn't accept credit card payments via UPI.  
>  
> **[Pay ₹{amount} via Slice Savings →]**  
>  
> _Your Slice Savings balance: ₹{balance}_

**Design principles:**
- **Contextual explanation** — Tell users *why* it failed (merchant policy, not their fault)
- **One-tap fallback** — Pre-populated retry with same merchant, amount, and session context
- **Zero friction** — No re-entry of UPI PIN if biometric auth is cached
- **Trust signal** — Show Slice Savings balance to reduce hesitation

**Edge cases:**

| Scenario | Behavior |
|---|---|
| Balance < amount | Show balance, disable CTA, suggest "Add money" |
| User dismisses sheet | Log `FALLBACK_DISMISSED`, show standard error |
| Second payment fails | Standard error, no loop |

**Technical requirements:**
- Backend: Add `rejection_reason` enum to transaction response
- Client: Bottom-sheet component (iOS/Android) on `MDR_REJECTION`
- Analytics: Log `FALLBACK_SHOWN` → `TAPPED` → `SUCCESS/FAILED/DISMISSED`

### Success Metrics

| Metric | Baseline | Target (4 wks) |
|---|---|---|
| Fallback adoption rate | N/A | ≥ 60% |
| 5-min churn rate post-rejection | 62.8% | ≤ 30% |
| Session completion rate | 37.2% | ≥ 70% |

**Guardrails:** Fallback transaction failure rate < 5%, time-to-completion < 10s, support tickets down ≥ 40%.

**Measurement:** A/B test on 10% Android users for 2 weeks, full funnel instrumentation, post-launch user interviews (n=20).

---

<details>
<summary>Technical Implementation</summary>

### Database Schema

```sql
CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
    account_vintage_days INT,
    default_payment_method VARCHAR(20)
);

CREATE TABLE Transactions (
    transaction_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    transaction_time TIMESTAMP,
    merchant_category VARCHAR(50),
    amount DECIMAL(10,2),
    payment_method_attempted VARCHAR(20),
    status VARCHAR(30),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

### Query 1: Base Funnel Analysis

```sql
SELECT 
    status, 
    COUNT(transaction_id) as volume,
    ROUND(COUNT(transaction_id) * 100.0 / (SELECT COUNT(*) FROM Transactions), 2) as percentage
FROM 
    Transactions
GROUP BY 
    status
ORDER BY 
    volume DESC;
```

### Query 2: Next-Action Churn Analysis (Window Functions)

```sql
WITH NextTransactionData AS (
    SELECT 
        user_id,
        transaction_time,
        status as current_status,
        LEAD(transaction_time) OVER(PARTITION BY user_id ORDER BY transaction_time) as next_txn_time,
        LEAD(status) OVER(PARTITION BY user_id ORDER BY transaction_time) as next_status,
        LEAD(payment_method_attempted) OVER(PARTITION BY user_id ORDER BY transaction_time) as next_method
    FROM Transactions
)
SELECT 
    COUNT(*) as total_rejections,
    SUM(CASE WHEN next_status = 'SUCCESS' AND next_method = 'SLICE_SAVINGS' 
              AND TIMESTAMPDIFF(MINUTE, transaction_time, next_txn_time) <= 5 THEN 1 ELSE 0 END) as retained_users,
    SUM(CASE WHEN next_txn_time IS NULL OR TIMESTAMPDIFF(MINUTE, transaction_time, next_txn_time) > 5 THEN 1 ELSE 0 END) as churned_users
FROM NextTransactionData
WHERE current_status = 'MERCHANT_CC_REJECTED';
```

### Data Generation Logic

The synthetic data generator (`data_generation/generate_transactions.py`) implements:
- **500 users**, **10,000 transactions** across 8 merchant categories
- **MDR rejection trigger:** `SLICE_CC` + amount > ₹2,000 + `KIRANA`/`RETAIL` → 40% rejection rate
- **Post-rejection fork:** 35% retry via Slice Savings (retention) / 65% no follow-up (churn)
- Batch inserts (500 rows/batch) via `pymysql`

</details>

---

## Future Scope

- Production data validation with live transaction logs
- Merchant-level MDR rejection rate analysis
- Time-series tracking of MDR rejection trends
- A/B testing the Smart Fallback UI
- ML-based pre-emptive payment method suggestions

---

## Resume Bullet

> **UPI Fallback Optimization** — Built a MySQL-backed analytics pipeline (10K synthetic transactions, window functions with `LEAD()`/`PARTITION BY`) to quantify 63% session churn from MDR-rejected UPI-CC payments; authored a PRD for a Smart Fallback UI projected to cut churn to ≤30%, with full A/B test measurement plan.

---

*Built as a data analytics + product management portfolio project. Synthetic data — production validation required.*
