// Shared realistic dashboard data for Slice Analytics — UPI Payment Insights

export const COLORS = {
  primary: "#a855f7", // slice purple
  magenta: "#ec4899",
  blue: "#60a5fa",
  success: "#22c99a",
  warning: "#f5a524",
  danger: "#f0476a",
  muted: "#8b8ea3",
  grid: "rgba(255,255,255,0.06)",
};

export const navItems = [
  "Dashboard",
  "Transaction Analysis",
  "Churn Analysis",
  "Fallback Performance",
  "Experiment Metrics",
];

export type StatusRow = {
  key: string;
  label: string;
  count: number;
  pct: number;
  color: string;
  highlight?: boolean;
};

export const statusDistribution: StatusRow[] = [
  { key: "success", label: "SUCCESS", count: 8373, pct: 83.73, color: COLORS.success },
  { key: "insufficient", label: "INSUFFICIENT_BALANCE", count: 502, pct: 5.02, color: COLORS.blue },
  { key: "timeout", label: "TIMEOUT", count: 465, pct: 4.65, color: COLORS.warning },
  { key: "network", label: "NETWORK_ERROR", count: 453, pct: 4.53, color: "#7c8299" },
  { key: "mdr", label: "MERCHANT_CC_REJECTED", count: 207, pct: 2.07, color: COLORS.magenta, highlight: true },
];

export type ChurnRow = {
  label: string;
  churn: number;
  level: "highest" | "medium" | "lower";
};

export const churnByFailure: ChurnRow[] = [
  { label: "Merchant CC Rejected", churn: 62.8, level: "highest" },
  { label: "Timeout", churn: 24.1, level: "medium" },
  { label: "Network Error", churn: 21.6, level: "medium" },
  { label: "Insufficient Balance", churn: 11.4, level: "lower" },
];

export const postRejection = [
  { name: "Churned", value: 62.8, users: 130, color: COLORS.danger },
  { name: "Retained", value: 37.2, users: 77, color: COLORS.success },
];

// Mini-trend sparkline data for KPI cards
export const spark = {
  transactions: [7100, 7480, 7220, 8010, 8640, 9210, 9560, 10000],
  success: [79.1, 80.4, 81.2, 82.0, 82.6, 83.1, 83.5, 83.73],
  mdr: [140, 156, 168, 172, 185, 191, 199, 207],
  churn: [58.2, 59.4, 60.1, 60.9, 61.6, 62.0, 62.4, 62.8],
};

export type Finding = {
  insight: string;
  metric: string;
  impact: string;
  status: string;
  tone: "warning" | "danger" | "opportunity";
};

export const keyFindings: Finding[] = [
  {
    insight: "MDR Rejections",
    metric: "2.07% of all transactions",
    impact: "High downstream impact",
    status: "Needs attention",
    tone: "warning",
  },
  {
    insight: "Failure Contribution",
    metric: "12.7% of failed transactions",
    impact: "Major non-technical failure source",
    status: "Investigate",
    tone: "warning",
  },
  {
    insight: "Post-Rejection Churn",
    metric: "62.8%",
    impact: "Primary product opportunity",
    status: "Critical",
    tone: "danger",
  },
  {
    insight: "Organic Fallback",
    metric: "37.2%",
    impact: "Users discover workaround without guidance",
    status: "Opportunity",
    tone: "opportunity",
  },
];
