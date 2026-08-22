Design a high-fidelity **desktop web analytics dashboard** for a fintech product called **Slice**.

The dashboard is for a product manager and data analyst monitoring **UPI-linked Credit Card transaction failures and user churn caused by merchant MDR rejection**.

## Overall Design Direction

Create a modern, premium, data-driven fintech dashboard inspired by Stripe, Mixpanel, Amplitude, and modern banking analytics platforms.

Style:

* Clean, minimal, professional fintech aesthetic
* Dark navy/charcoal background with elevated cards
* Use Slice-inspired vibrant purple/magenta as the primary accent
* Secondary accents: soft blue, green for positive metrics, red/orange for risks and churn
* Rounded cards with subtle borders and soft shadows
* Plenty of whitespace
* Modern sans-serif typography
* Desktop-first layout, approximately 1440px wide
* Do not make it look like a generic admin template
* Prioritize storytelling and product insights

## App Name and Header

Top-left branding:

**SLICE ANALYTICS**
Small subtitle: **UPI PAYMENT INSIGHTS**

Create a top navigation/header with:

* Dashboard
* Transaction Analysis
* Churn Analysis
* Fallback Performance
* Experiment Metrics

Highlight **Dashboard** as the active page.

On the right side:

* Date range selector: **Last 30 Days**
* Filter icon
* Export button
* Small user avatar

---

# MAIN DASHBOARD

## 1. Hero Section

At the top, create a strong heading:

**UPI Payment Health**

Subtitle:

**Monitor transaction failures, merchant MDR rejections, and their impact on user retention.**

On the right, add a compact insight card with a warning icon:

**Critical Insight**
**62.8%**
Users abandon within 5 minutes after an MDR rejection.

Add supporting text:

**Merchant-initiated failures have the highest downstream churn impact.**

Make this insight visually prominent.

---

## 2. KPI Cards Row

Create four premium KPI cards.

### Card 1

Label: **Total Transactions**
Value: **10,000**
Small trend: **↑ 8.4% vs previous period**
Icon: transaction/activity icon

### Card 2

Label: **Successful Payments**
Value: **8,373**
Supporting metric: **83.73% success rate**
Use a subtle green positive indicator.

### Card 3

Label: **MDR Rejections**
Value: **207**
Supporting metric: **2.07% of total transactions**
Use a warning/red accent.

### Card 4

Label: **5-Minute Churn**
Value: **62.8%**
Supporting metric: **130 users abandoned**
Use the strongest visual warning treatment.

Each card should have a small contextual icon and a subtle mini trend visualization.

---

# 3. TRANSACTION STATUS OVERVIEW

Create a large card titled:

**Transaction Status Distribution**

Subtitle:

**Breakdown of all payment outcomes**

Use a modern horizontal bar chart or donut chart showing:

* SUCCESS — 8,373 — 83.73%
* INSUFFICIENT_BALANCE — 502 — 5.02%
* TIMEOUT — 465 — 4.65%
* NETWORK_ERROR — 453 — 4.53%
* MERCHANT_CC_REJECTED — 207 — 2.07%

Visually emphasize **MERCHANT_CC_REJECTED** using the Slice purple/red accent.

On the right side of this chart, add an insight panel:

**12.7% of all failed transactions are MDR rejections**

Supporting text:

Unlike technical failures, MDR rejection cannot be solved by retrying with the same payment method.

Add a small “View Analysis →” link.

---

# 4. CORE FUNNEL SECTION

Create a visually strong full-width section titled:

**MDR Rejection → User Outcome Funnel**

This should be the centerpiece of the dashboard.

Show a horizontal funnel:

### Step 1

**207**
MDR Rejections

Arrow →

### Step 2

Split the flow into two paths.

#### Retained path — positive

**77 users**
**37.2%**
Retried successfully using Slice Savings

#### Churned path — negative

**130 users**
**62.8%**
Abandoned the app within 5 minutes

Make the churn path visually larger and more prominent.

Below the funnel, include a product insight banner:

**The biggest opportunity is immediately after a merchant rejects Slice CC. Only 37.2% of users discover the Slice Savings workaround organically.**

---

# 5. CHURN ANALYSIS

Create a two-column layout.

## Left Card: Churn by Failure Type

Title:

**Which Failures Drive Churn?**

Use a horizontal comparison bar chart.

Compare:

* Merchant CC Rejected — Highest
* Timeout — Medium
* Network Error — Medium
* Insufficient Balance — Lower

Clearly visually highlight:

**MDR Rejection — 62.8% churn**

Add a small annotation:

**Merchant-initiated rejection is the most damaging payment failure.**

## Right Card: Post-Rejection User Behavior

Use a donut chart.

Center text:

**207**
Rejected Sessions

Segments:

* 62.8% Churned
* 37.2% Retained

Below it:

**77 users successfully switched to Slice Savings.**

---

# 6. PRODUCT OPPORTUNITY SECTION

Create a visually distinct section with a subtle purple gradient background.

Title:

**Smart Fallback Opportunity**

Display a simplified mock flow:

### Current Experience

**Slice CC Payment**
→
**Merchant Rejects**
→
**Generic Transaction Failed Screen**
→
**62.8% User Churn**

Use red/orange accents.

Then show:

### Proposed Experience

**Slice CC Payment**
→
**Merchant Rejects**
→
**Smart Fallback Bottom Sheet**
→
**Pay via Slice Savings**
→
**Higher Session Completion**

Use purple and green accents.

Inside the Smart Fallback mockup, show:

**Credit Card blocked by merchant**

This merchant doesn't accept credit card payments via UPI.

Primary CTA:

**Pay ₹2,450 via Slice Savings →**

Secondary information:

**Slice Savings balance: ₹8,620**

This section should make the dashboard feel connected to an actual product decision, not just analytics.

---

# 7. SUCCESS METRICS / TARGETS

Create three goal cards.

### Fallback Adoption

Baseline: **N/A**
Target: **≥ 60%**

Show progress-style visualization.

### 5-Minute Churn Rate

Baseline: **62.8%**
Target: **≤ 30%**

Show a before-versus-target comparison.

### Session Completion

Baseline: **37.2%**
Target: **≥ 70%**

Show a positive upward trend visualization.

Add a small label:

**4-Week Post-Launch Targets**

---

# 8. BOTTOM INSIGHTS TABLE

Create a clean table titled:

**Key Findings**

Columns:

* Insight
* Metric
* Impact
* Status

Rows:

**MDR Rejections**
2.07% of all transactions
High downstream impact
⚠ Needs attention

**Failure Contribution**
12.7% of failed transactions
Major non-technical failure source
⚠ Investigate

**Post-Rejection Churn**
62.8%
Primary product opportunity
🔴 Critical

**Organic Fallback**
37.2%
Users discover workaround without guidance
🟣 Opportunity

---

# 9. DESIGN DETAILS

Use:

* Clean 12-column desktop grid
* Card spacing of approximately 20–24px
* Rounded corners around 12–16px
* Thin low-contrast borders
* Charts with clear labels and tooltips
* No excessive gradients
* Subtle micro-interaction indicators
* Strong visual hierarchy
* Large numbers for important metrics
* Avoid clutter

The dashboard should communicate one clear story:

**A relatively small number of merchant MDR rejections causes disproportionately high user churn, and a Smart Fallback to Slice Savings can significantly improve session completion.**

Include realistic chart data and polished UI components. Make the final design feel like an internal analytics dashboard used by the Product and Data teams at a high-growth Indian fintech company.

Important: Build the complete dashboard as one cohesive screen. Include all sections, charts, KPI cards, funnel visualization, product opportunity section, and success metrics. Focus on polished visual storytelling and a portfolio-quality final result.
