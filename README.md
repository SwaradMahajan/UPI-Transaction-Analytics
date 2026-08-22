# UPI Analytics — Payment Metrics, Churn Analysis & PRD

**Small merchants frequently reject UPI-linked credit card payments to avoid MDR processing fees — and 63% of affected users abandon the app within 5 minutes.** This project uses MySQL, Python, and SQL window functions to quantify the churn impact of `MERCHANT_CC_REJECTED` failures, delivers a Product Requirements Document (PRD) for a Smart Fallback UI that cuts churn to ≤30%, and includes an interactive React analytics dashboard with a live simulation engine.

Built with: MySQL 8.0 · Python 3 · Faker · Raw SQL (aggregation + window functions) · React 18 · Vite · TailwindCSS · Recharts · Radix UI / shadcn

---

## Quick Start

### 1. Database & SQL Analytics Pipeline
```bash
# 1. Create database & tables
mysql -u root -p < schema/schema.sql

# 2. Install Python dependencies
pip install faker pymysql

# 3. Generate 10,000 synthetic transactions
python data_generation/generate_transactions.py

# 4. Run SQL analysis
mysql -u root -p upi_analytics < analysis/01_base_funnel_analysis.sql
mysql -u root -p upi_analytics < analysis/02_next_action_churn.sql
```

### 2. Interactive Analytics Dashboard (React + Vite)
```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

## Project Structure

```
UPI-Analytics-PRD/
├── README.md                              # This file (GitHub storefront + PRD)
├── report.md                              # Full project report
├── schema/
│   └── schema.sql                         # MySQL schema (Users + Transactions)
├── data_generation/
│   └── generate_transactions.py           # Synthetic data generator (10k rows)
├── analysis/
│   ├── 01_base_funnel_analysis.sql        # Transaction status funnel query
│   └── 02_next_action_churn.sql           # Window function churn analysis query
├── prd/
│   └── UPI_Fallback_PRD.md                # Product Requirements Document
├── dashboard/                             # Interactive React + Vite Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── Header.tsx             # Navigation & branding
│   │   │   │   ├── Hero.tsx               # Payment health summary & critical stat
│   │   │   │   ├── SimulationWindow.tsx   # Live transaction parameter tuning & engine
│   │   │   │   ├── simulationEngine.ts    # Monte Carlo simulation engine
│   │   │   │   ├── KpiCards.tsx           # Sparkline metric cards
│   │   │   │   ├── StatusDistribution.tsx # Visual status breakdown & insights
│   │   │   │   ├── Funnel.tsx             # MDR rejection user journey funnel
│   │   │   │   ├── ChurnAnalysis.tsx      # Recharts bar chart & donut visualization
│   │   │   │   ├── Opportunity.tsx        # Smart fallback workflow & UI mockup
│   │   │   │   ├── Targets.tsx            # 4-week success metric benchmarks
│   │   │   │   ├── FindingsTable.tsx      # Categorized executive findings
│   │   │   │   └── data.ts                # Metric models & constants
│   │   │   └── App.tsx                    # Main dashboard container
│   │   └── main.tsx                       # Entry point
│   ├── package.json                       # Dependencies (Recharts, Radix, Tailwind)
│   └── vite.config.ts                     # Vite build configuration
└── assets/
    └── sql_findings_screenshot.png        # Query results screenshot
```

---

## The Problem

UPI-linked credit card (`UPI_CC`) transactions are growing fast, but micro and small merchants — particularly kirana stores and local retailers — reject these payments to avoid the ~1.5–2% Merchant Discount Rate (MDR) fee. The user sees a generic "Transaction Failed" screen with no explanation and no fallback option.

**Result:** A 62.8% session churn rate after MDR rejections — the highest churn rate of any transaction failure type.

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
| **Retained** (retried via UPI Savings) | 77 | 37.2% |

> **"When users face an MDR rejection, 62.8% abandon the app entirely within a 5-minute window."**

---

## Interactive Dashboard Features

The integrated React dashboard (`dashboard/`) visualizes these insights:

1. **Simulation Control Window**: Configure total transaction volume (1K–50K+), MDR rejection probability, retry rate, and baseline reliability to test scenarios in real-time.
2. **KPI Scorecard**: Real-time transaction volume, success rates, MDR rejection count, and 5-min churn rate with trend sparklines.
3. **Status Distribution**: Breakdown across all payment outcomes highlighting MDR rejections as 12.7% of all transaction failures.
4. **MDR Funnel**: Step-by-step path comparing churned users (130) vs. retained users (77).
5. **Failure Churn Comparison**: Recharts bar chart showing MDR rejections (62.8%) far exceed timeouts (24.1%), network errors (21.6%), and balance issues (11.4%).
6. **Interactive PRD Solution Mockup**: Interactive flow comparing the current failure experience against the proposed Smart Fallback Bottom Sheet.
7. **4-Week Target Scorecard**: Progress trackers towards reducing 5-minute churn from 62.8% to ≤30% and lifting session completion to ≥70%.

---

## Product Requirements Document: Smart Fallback UI

### Problem Statement

UPI-CC is scaling, but MDR avoidance by small merchants causes a ~63% session churn rate when transactions are rejected. Users see a generic error with no context about *why* their payment failed and no guidance on how to complete their purchase.

### Data Evidence

- **2.07%** of all transactions are `MERCHANT_CC_REJECTED`
- **62.8%** of affected users churn within 5 minutes
- Only **37.2%** organically discover the UPI Savings workaround — with zero UI guidance
- All MDR rejections occur on **high-value transactions (> ₹2,000)** at kirana/retail merchants

### Proposed Solution: Smart Fallback UI

When the backend returns `MERCHANT_CC_REJECTED`, **do not show a generic error.** Instead, trigger a **bottom-sheet overlay**:

> **"Credit Card blocked by merchant"**  
> This merchant does not accept credit card payments via UPI.  
>  
> **[Pay ₹{amount} via UPI Savings Account →]**  
>  
> _Your UPI Savings balance: ₹{balance}_

**Design principles:**
- **Contextual explanation** — Tell users *why* it failed (merchant policy, not their fault)
- **One-tap fallback** — Pre-populated retry with same merchant, amount, and session context
- **Zero friction** — No re-entry of UPI PIN if biometric auth is cached
- **Trust signal** — Show UPI Savings balance to reduce hesitation

**Edge cases:**

| Scenario | Behavior |
|---|---|
| Balance < amount | Show balance, disable CTA, suggest "Add money / Select another bank" |
| User dismisses sheet | Log `FALLBACK_DISMISSED`, show standard payment selection |
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

**Measurement:** A/B test on 10% users for 2 weeks, full funnel instrumentation, post-launch user interviews (n=20).

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
    SUM(CASE WHEN next_status = 'SUCCESS' AND next_method = 'UPI_SAVINGS' 
              AND TIMESTAMPDIFF(MINUTE, transaction_time, next_txn_time) <= 5 THEN 1 ELSE 0 END) as retained_users,
    SUM(CASE WHEN next_txn_time IS NULL OR TIMESTAMPDIFF(MINUTE, transaction_time, next_txn_time) > 5 THEN 1 ELSE 0 END) as churned_users
FROM NextTransactionData
WHERE current_status = 'MERCHANT_CC_REJECTED';
```

### Data Generation Logic

The synthetic data generator (`data_generation/generate_transactions.py`) implements:
- **500 users**, **10,000 transactions** across 8 merchant categories
- **MDR rejection trigger:** `UPI_CC` + amount > ₹2,000 + `KIRANA`/`RETAIL` → 40% rejection rate
- **Post-rejection fork:** 35% retry via `UPI_SAVINGS` (retention) / 65% no follow-up (churn)
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

> **UPI Analytics & Fallback Optimization** — Built an end-to-end analytics and product suite (MySQL pipeline, 10K transactions, SQL window functions `LEAD()`/`PARTITION BY`, React dashboard with Monte Carlo simulation) quantifying 63% churn from MDR-rejected UPI credit card payments; authored a PRD for a Smart Fallback UI projected to cut churn to ≤30% with a full A/B test framework.

---

*Built as a data analytics + product management portfolio project. Synthetic data — production validation required.*
