# Product Requirements Document: Smart Fallback UI for UPI-CC MDR Rejections

**Author:** Slice Product & Analytics Team  
**Date:** August 2025  
**Status:** Draft — Pending Engineering Review  

---

## 1. Problem Statement

UPI-linked credit card (`SLICE_CC`) usage is scaling rapidly, but a specific class of transaction failures is silently eroding user retention: **Merchant Discount Rate (MDR) avoidance by small merchants.**

When a user pays via Slice CC at a kirana store or local retailer, the merchant's payment terminal may reject the credit card leg of the transaction to avoid paying the ~1.5–2% MDR fee — returning a `MERCHANT_CC_REJECTED` status. Unlike technical failures (timeouts, network errors), this rejection is **merchant-initiated and invisible to the user**, who sees only a generic "Transaction Failed" screen.

**The impact is severe.** Our analysis of 10,000 transactions shows:

- **2.07% of all transactions** end in `MERCHANT_CC_REJECTED` — a small share of total volume, but a disproportionately damaging failure mode.
- **62.8% of users who face this rejection churn within 5 minutes** — they abandon the session entirely without completing a purchase.
- Only **37.2% of rejected users** organically discover the workaround of switching to Slice Savings to complete the payment.

This means for every 100 MDR rejections, **~63 users leave the app frustrated**, while only ~37 manage to self-serve a retry. The current generic error screen provides zero guidance, zero fallback options, and zero context about *why* the payment failed.

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

**Key insight:** While `MERCHANT_CC_REJECTED` accounts for only 2.07% of total transactions, it is unique among failure types because:
1. It is **merchant-caused, not user-caused** — users cannot prevent or retry it with the same method.
2. It has the **highest churn correlation** of any failure type (62.8% session abandonment within 5 minutes).
3. It disproportionately affects **high-value transactions** (all rejected transactions are > ₹2,000) at kirana/retail merchants — Slice's core use case.

### 2.2 Post-Rejection User Behavior (Churn Analysis)

Using SQL window functions (`LEAD()` with `PARTITION BY user_id`), we tracked what users do within 5 minutes after an MDR rejection:

| Outcome | Count | % of Rejections |
|---|---|---|
| **Churned** (no follow-up within 5 min) | 130 | 62.8% |
| **Retained** (retried via Slice Savings) | 77 | 37.2% |
| **Total MDR Rejections** | 207 | 100% |

**Headline finding:** When users face an MDR rejection, **62.8% abandon the app entirely within a 5-minute window.** The 37.2% who retry do so by manually switching to Slice Savings — a workaround they discovered on their own, with no UI guidance.

---

## 3. Proposed Solution: Smart Fallback UI

### 3.1 Trigger

When the payments backend returns `status = 'MERCHANT_CC_REJECTED'`, the client should **not** display the generic "Transaction Failed" error screen.

### 3.2 UX Flow

Instead, trigger a **bottom-sheet overlay** with the following content:

> **"Credit Card blocked by merchant"**  
> This merchant doesn't accept credit card payments via UPI.  
>  
> **[Pay ₹{amount} via Slice Savings →]**  
>  
> _Your Slice Savings balance: ₹{balance}_

**Design principles:**
- **Contextual explanation** — Tell the user *why* it failed (merchant policy), not just *that* it failed.
- **One-tap fallback** — Pre-populate the retry with the same merchant, amount, and session context. The user taps once to pay via Slice Savings.
- **Zero friction** — No re-entry of UPI PIN if biometric auth is cached. No navigation away from the payment screen.
- **Trust signal** — Show the user's Slice Savings balance to reduce hesitation.

### 3.3 Edge Cases

| Scenario | Behavior |
|---|---|
| Slice Savings balance < transaction amount | Show balance, disable CTA, suggest "Add money to Savings" |
| User dismisses bottom sheet | Log as `FALLBACK_DISMISSED`, show standard error screen |
| Second payment also fails | Show standard error, do not loop |
| Merchant category is not KIRANA/RETAIL | Still show fallback (MDR avoidance is not limited to these categories in production) |

### 3.4 Technical Requirements

- **Backend:** Add a `rejection_reason` enum field to the transaction response payload. Map terminal response codes to `MDR_REJECTION` vs. `TECHNICAL_FAILURE`.
- **Client:** Implement bottom-sheet component (iOS/Android) triggered by `rejection_reason = 'MDR_REJECTION'`.
- **Analytics:** Log `FALLBACK_SHOWN`, `FALLBACK_TAPPED`, `FALLBACK_DISMISSED`, `FALLBACK_SUCCESS`, `FALLBACK_FAILED` events for funnel tracking.

---

## 4. Success Metrics

### 4.1 Primary Metrics

| Metric | Current Baseline | Target (4 weeks post-launch) |
|---|---|---|
| **Fallback adoption rate** (taps / shown) | N/A (feature doesn't exist) | ≥ 60% |
| **5-minute churn rate** post-MDR-rejection | 62.8% | ≤ 30% |
| **Session completion rate** after MDR rejection | 37.2% | ≥ 70% |

### 4.2 Guardrail Metrics

| Metric | Threshold |
|---|---|
| Slice Savings transaction failure rate via fallback | Must not exceed 5% |
| Average time-to-completion after fallback tap | Must be < 10 seconds |
| User complaints / support tickets related to MDR | Decrease by ≥ 40% |

### 4.3 Measurement Plan

- **A/B test:** Roll out to 10% of Android users for 2 weeks, measure churn rate delta vs. control (generic error screen).
- **Instrumentation:** Track the full funnel — `REJECTION → FALLBACK_SHOWN → FALLBACK_TAPPED → FALLBACK_SUCCESS` — to identify drop-off points.
- **Qualitative:** Post-launch user interviews (n=20) to validate that the bottom-sheet messaging is clear and trustworthy.

---

*This PRD is based on synthetic data analysis of 10,000 UPI transactions. Production validation with live data is required before engineering kickoff.*
