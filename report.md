# UPI Analytics — Payment Metrics & Fallback Churn Analysis Report

## Overview

This project investigates a specific friction point in UPI-linked credit card transactions: **MDR (Merchant Discount Rate) avoidance by micro & small merchants**, where kirana stores and local retailers reject credit card transactions to avoid payment processing fees. We built a complete data pipeline — from schema design to synthetic data generation to SQL window function analysis, coupled with an interactive React analytics dashboard and a formal PRD — to quantify the churn impact and engineer a Smart Fallback product solution.

---

## Tech Stack

| Component | Technology |
|---|---|
| Database | MySQL 8.0 (local instance, MySQL Workbench compatible) |
| Scripting | Python 3 |
| Libraries | `faker` (synthetic data), `pymysql` (MySQL connector) |
| Analysis | Raw SQL with aggregation and window functions (`LEAD()`, `PARTITION BY`) |
| Interactive Dashboard | React 18, Vite, TailwindCSS, Recharts, Radix UI / shadcn |
| Documentation | Markdown (README.md, PRD, this report) |
| Version Control | Git / GitHub |

---

## Database Design

Two normalized tables in the `upi_analytics` database:

- **Users** — 500 synthetic users with `user_id`, `account_vintage_days`, and `default_payment_method`.
- **Transactions** — 10,000 synthetic transactions with full metadata: timestamp, merchant category, amount, payment method attempted (`UPI_CC`, `UPI_SAVINGS`, `UPI_OTHER`, `DEBIT_CARD`), and transaction status.

The schema enforces referential integrity via a foreign key from `Transactions.user_id` → `Users.user_id`.

---

## File Structure

```
UPI-Analytics-PRD/
├── README.md                              # GitHub storefront with embedded PRD
├── report.md                              # This report
├── schema/
│   └── schema.sql                         # MySQL table definitions
├── data_generation/
│   └── generate_transactions.py           # Synthetic data generator (Python)
├── analysis/
│   ├── 01_base_funnel_analysis.sql        # Transaction status funnel
│   └── 02_next_action_churn.sql           # Window function churn analysis
├── prd/
│   └── UPI_Fallback_PRD.md                # Product Requirements Document
├── dashboard/                             # Interactive React + Vite Analytics Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/                # Modular React dashboard components
│   │   │   └── App.tsx                    # Master dashboard view
│   │   └── main.tsx                       # React root
│   ├── package.json                       # Front-end dependencies
│   └── vite.config.ts                     # Vite build config
└── assets/
    └── sql_findings_screenshot.png        # Query results (placeholder)
```

---

## Build & Execution Steps

### Prerequisites
- MySQL 8.0+ running locally
- Python 3.x with `pip`
- Node.js 18+ and `npm`

### Step-by-step

```bash
# 1. Create the database and tables
mysql -u root -p < schema/schema.sql

# 2. Install Python dependencies
pip install faker pymysql

# 3. Generate synthetic data (~10,000 transactions)
python data_generation/generate_transactions.py

# 4. Run base funnel analysis
mysql -u root -p upi_analytics < analysis/01_base_funnel_analysis.sql

# 5. Run churn analysis
mysql -u root -p upi_analytics < analysis/02_next_action_churn.sql

# 6. Launch the interactive analytics dashboard
cd dashboard
npm install
npm run dev
```

---

## Key Findings

### Finding 1: Transaction Status Funnel

| Status | Volume | % of Total |
|---|---|---|
| SUCCESS | 8,373 | 83.73% |
| INSUFFICIENT_BALANCE | 502 | 5.02% |
| TIMEOUT | 465 | 4.65% |
| NETWORK_ERROR | 453 | 4.53% |
| MERCHANT_CC_REJECTED | 207 | 2.07% |

`MERCHANT_CC_REJECTED` accounts for **2.07% of all transactions** — a concentrated share of total volume, but unlike technical failures (timeout, network error), this failure type is entirely merchant-initiated and has the highest downstream impact on user behavior.

Among all failed transactions (1,627 total), `MERCHANT_CC_REJECTED` represents **12.7% of failures** — comparable in volume to any single technical failure type, but uniquely damaging because the user cannot resolve it by retrying with the same payment method.

### Finding 2: Post-Rejection Churn Rate

| Metric | Value |
|---|---|
| Total MDR Rejections | 207 |
| Users who retried via UPI Savings (retained) | 77 (37.2%) |
| Users who abandoned the session (churned) | 130 (62.8%) |

**Headline insight: When users face an MDR rejection, 62.8% abandon the app entirely within a 5-minute window.**

The 37.2% retention rate comes from users who organically discovered the workaround of switching to a UPI Savings Account — without any UI guidance. This demonstrates strong headroom for improvement with a guided Smart Fallback experience.

---

## Interactive Dashboard Implementation

The project includes an interactive web dashboard in `dashboard/` with:
- **Dark-mode fintech aesthetic** with custom gradient accents.
- **Simulation Control Window** with real-time parameter tuning (total transactions, rejection probabilities, threshold amounts, and Monte Carlo engine).
- **KPI sparkline cards** tracking volume, success rate, MDR rejections, and churn.
- **Dynamic Recharts** visualizing failure-level churn comparisons and session outcome distributions.
- **Step-by-step journey diagrams** contrasting current vs. proposed fallback user experiences.
- **Live 4-week target milestones** with metric trackers.

---

## Future Scope

1. **Production data validation** — Run the same churn analysis on live transaction logs to validate synthetic findings.
2. **Merchant-level analysis** — Identify specific merchants with high MDR rejection rates and consider merchant-side interventions.
3. **Time-series analysis** — Track whether MDR rejections are increasing as UPI-CC adoption grows.
4. **A/B test the Smart Fallback UI** — Implement the PRD's proposed bottom-sheet solution and measure churn rate reduction in a controlled rollout.
5. **ML-based prediction** — Build a model to predict MDR rejection likelihood *before* the transaction, enabling pre-emptive payment method suggestions.

---

*Report generated from synthetic data analysis of 10,000 UPI transactions across 500 users.*
