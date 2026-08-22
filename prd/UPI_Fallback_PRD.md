# Product Requirements Document: Smart Fallback UI for UPI-CC MDR Rejections

**Author:** UPI Product & Analytics Team  
**Date:** August 2026  
**Status:** Draft — Ready for Engineering Review  

---

## 1. Problem Statement

UPI-linked credit card (`UPI_CC`) usage is scaling rapidly across payment apps, but a specific class of transaction failures is silently eroding user retention: **Merchant Discount Rate (MDR) avoidance by small merchants.**

When a user attempts to pay via a UPI-linked Credit Card at a kirana store or local retailer, the merchant's payment soundbox/QR terminal frequently rejects the credit card leg of the transaction to avoid paying the ~1.5–2% MDR processing fee — returning a `MERCHANT_CC_REJECTED` status code. Unlike technical failures (timeouts, network drops), this rejection is **merchant-initiated and invisible to the user**, who receives only an ambiguous "Transaction Failed" generic screen.

**The impact is severe.** Our analysis of 10,000 transactions shows:

- **2.07% of all transactions** end in `MERCHANT_CC_REJECTED` — a concentrated share of total volume, but a disproportionately damaging failure mode.
- **62.8% of users who face this rejection churn within 5 minutes** — they abandon the payment session entirely without completing a purchase.
- Only **37.2% of rejected users** organically discover the workaround of switching to their linked UPI Savings Account to complete the payment.

This means for every 100 MDR rejections, **~63 users leave the payment flow frustrated**, while only ~37 manage to self-serve a retry. The current generic error screen provides zero guidance, zero fallback options, and zero context about *why* the payment failed.

---

## 2. Data Evidence

### 2.1 Transaction Status Funnel

| Status | Volume | % of Total |
|---|---|---|
| SUCCESS | 8,373 | 83.73% |
| INSUFFICIENT_BALANCE | 502 | 5.02% |
| TIMEOUT | 465 | 4.65% |
| NETWORK_ERROR | 453 | 4.53% |
| MERCHANT_CC_REJECTED | 207 | 2.07% |

**Key insight:** While `MERCHANT_CC_REJECTED` accounts for 2.07% of total transactions, it is unique among failure types because:
1. It is **merchant-caused, not user-caused** — users cannot prevent or retry it with the same credit card payment method.
2. It has the **highest churn correlation** of any failure type (62.8% session abandonment within 5 minutes).
3. It disproportionately affects **high-value transactions** (all rejected transactions are > ₹2,000) at kirana/retail merchants.

### 2.2 Post-Rejection User Behavior (Churn Analysis)

Using SQL window functions (`LEAD()` with `PARTITION BY user_id`), we tracked what users do within 5 minutes after an MDR rejection:

| Outcome | Count | % of Rejections |
|---|---|---|
| **Churned** (no follow-up within 5 min) | 130 | 62.8% |
| **Retained** (retried via UPI Savings Account) | 77 | 37.2% |
| **Total MDR Rejections** | 207 | 100% |

**Headline finding:** When users face an MDR rejection, **62.8% abandon the app entirely within a 5-minute window.** The 37.2% who retry do so by manually switching to a UPI Savings Account — a workaround they discovered on their own, with no UI guidance.

---

## 3. Proposed Solution: Smart Fallback UI

### 3.1 Trigger

When the payments switch/backend returns `status = 'MERCHANT_CC_REJECTED'`, the client application should **not** display the generic "Transaction Failed" error screen.

### 3.2 UX Flow

Instead, trigger an immediate **bottom-sheet overlay**:

> **"Credit Card blocked by merchant"**  
> This merchant does not accept credit card payments via UPI.  
>  
> **[Pay ₹{amount} via UPI Savings Account →]**  
>  
> _Your UPI Savings balance: ₹{balance}_

**Design principles:**
- **Contextual explanation** — Tell the user *why* it failed (merchant policy), not just *that* it failed.
- **One-tap fallback** — Pre-populate the retry with the same merchant, amount, and session context. The user taps once to pay via their default UPI Savings Account.
- **Zero friction** — No re-entry of UPI PIN if biometric authentication is cached. No navigation away from the payment screen.
- **Trust signal** — Show the user's available balance to eliminate hesitation.

### 3.3 Edge Cases

| Scenario | Behavior |
|---|---|
| UPI Savings balance < transaction amount | Show balance, disable CTA, suggest "Add money / Select another bank" |
| User dismisses bottom sheet | Log as `FALLBACK_DISMISSED`, show standard payment selection |
| Second payment also fails | Show standard error, do not loop |
| Merchant category is not KIRANA/RETAIL | Still show fallback (MDR avoidance is prevalent across micro-merchants) |

### 3.4 Technical Requirements

- **Backend:** Add a `rejection_reason` enum field to the transaction response payload. Map payment gateway response codes to `MDR_REJECTION` vs. `TECHNICAL_FAILURE`.
- **Client:** Implement a reusable bottom-sheet component (iOS/Android/Web) triggered by `rejection_reason = 'MDR_REJECTION'`.
- **Analytics:** Log `FALLBACK_SHOWN`, `FALLBACK_TAPPED`, `FALLBACK_DISMISSED`, `FALLBACK_SUCCESS`, `FALLBACK_FAILED` events for end-to-end funnel instrumentation.

---

## 4. Success Metrics

### 4.1 Primary Metrics

| Metric | Current Baseline | Target (4 weeks post-launch) |
|---|---|---|
| **Fallback adoption rate** (taps / shown) | N/A (new capability) | ≥ 60% |
| **5-minute churn rate** post-MDR-rejection | 62.8% | ≤ 30% |
| **Session completion rate** after MDR rejection | 37.2% | ≥ 70% |

### 4.2 Guardrail Metrics

| Metric | Threshold |
|---|---|
| UPI Savings transaction failure rate via fallback | Must not exceed 5% |
| Average time-to-completion after fallback tap | Must be < 10 seconds |
| User complaints / support tickets related to MDR | Decrease by ≥ 40% |

### 4.3 Measurement Plan

- **A/B test:** Roll out to 10% of active users for 2 weeks, measure churn rate delta vs. control (generic error screen).
- **Instrumentation:** Track the full funnel — `REJECTION → FALLBACK_SHOWN → FALLBACK_TAPPED → FALLBACK_SUCCESS` — to identify drop-off points.
- **Qualitative:** Post-launch user survey to validate that the bottom-sheet messaging is transparent and trustworthy.

---

*This PRD is part of the UPI Analytics & Optimization project suite.*
