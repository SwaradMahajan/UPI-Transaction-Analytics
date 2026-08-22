// Simulation Engine for UPI Payment Metrics
// Implements the synthetic data generation logic from the Python pipeline directly in browser

export interface SimulationParams {
  totalTransactions: number;
  mdrRejectionRate: number; // e.g. 0.40 (40%)
  retentionRate: number;    // e.g. 0.35 (35% retry with Slice Savings)
  baseSuccessRate: number;  // e.g. 0.85 (85%)
  amountThreshold: number;  // e.g. 2000
  seed?: number;
}

export interface StatusRow {
  key: string;
  label: string;
  count: number;
  pct: number;
  color: string;
  highlight?: boolean;
}

export interface ChurnRow {
  label: string;
  churn: number;
  level: "highest" | "medium" | "lower";
}

export interface Finding {
  insight: string;
  metric: string;
  impact: string;
  status: string;
  tone: "warning" | "danger" | "opportunity";
}

export interface SimulationResult {
  params: SimulationParams;
  seed: number;
  totalTransactions: number;
  successCount: number;
  successRate: number;
  mdrCount: number;
  mdrRate: number;
  retainedCount: number;
  churnedCount: number;
  churnRate: number;
  retentionRate: number;
  mdrShareOfFailures: number;
  statusDistribution: StatusRow[];
  churnByFailure: ChurnRow[];
  postRejection: Array<{ name: string; value: number; users: number; color: string }>;
  spark: {
    transactions: number[];
    success: number[];
    mdr: number[];
    churn: number[];
  };
  keyFindings: Finding[];
  runDurationMs: number;
  timestamp: string;
}

export const DEFAULT_PARAMS: SimulationParams = {
  totalTransactions: 10000,
  mdrRejectionRate: 0.40,
  retentionRate: 0.35,
  baseSuccessRate: 0.85,
  amountThreshold: 2000,
  seed: 42,
};

// Seeded LCG pseudo-random generator
function createRng(seed: number) {
  let s = Math.abs(seed) % 2147483647;
  if (s === 0) s = 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function runSimulation(userParams: Partial<SimulationParams> = {}): SimulationResult {
  const startTime = performance.now();
  const params: SimulationParams = {
    ...DEFAULT_PARAMS,
    ...userParams,
  };

  const seed = params.seed ?? Math.floor(Math.random() * 1000000);
  const rand = createRng(seed);

  const paymentMethods = ["SLICE_CC", "SLICE_SAVINGS", "UPI_OTHER", "DEBIT_CARD"];
  const merchantCategories = [
    "KIRANA", "RETAIL", "FOOD_DELIVERY", "ELECTRONICS",
    "TRAVEL", "ENTERTAINMENT", "GROCERY", "PHARMACY"
  ];
  const failureStatuses = ["TIMEOUT", "INSUFFICIENT_BALANCE", "NETWORK_ERROR"];

  const counts: Record<string, number> = {
    SUCCESS: 0,
    INSUFFICIENT_BALANCE: 0,
    TIMEOUT: 0,
    NETWORK_ERROR: 0,
    MERCHANT_CC_REJECTED: 0,
  };

  let mdrRejections = 0;
  let retainedUsers = 0;
  let churnedUsers = 0;
  let totalGenerated = 0;

  // Track sparkline checkpoints across 8 intervals
  const intervals = 8;
  const checkpointSize = Math.max(1, Math.floor(params.totalTransactions / intervals));
  const sparkTransactions: number[] = [];
  const sparkSuccess: number[] = [];
  const sparkMdr: number[] = [];
  const sparkChurn: number[] = [];

  while (totalGenerated < params.totalTransactions) {
    const paymentMethod = paymentMethods[Math.floor(rand() * paymentMethods.length)];
    const merchantCategory = merchantCategories[Math.floor(rand() * merchantCategories.length)];
    const amount = 50 + rand() * 14950;

    // MDR rejection condition
    if (
      paymentMethod === "SLICE_CC" &&
      amount > params.amountThreshold &&
      (merchantCategory === "KIRANA" || merchantCategory === "RETAIL")
    ) {
      if (rand() < params.mdrRejectionRate) {
        counts.MERCHANT_CC_REJECTED++;
        mdrRejections++;
        totalGenerated++;

        // Fork: Retention vs Churn
        if (rand() < params.retentionRate) {
          counts.SUCCESS++;
          retainedUsers++;
          totalGenerated++;
        } else {
          churnedUsers++;
        }

        // Sparkline recording
        if (totalGenerated % checkpointSize < 2 || totalGenerated >= params.totalTransactions) {
          const currentTotal = totalGenerated;
          const currentSuccessPct = (counts.SUCCESS / (currentTotal || 1)) * 100;
          const currentChurnPct = mdrRejections > 0 ? (churnedUsers / mdrRejections) * 100 : 62.8;
          if (sparkTransactions.length < intervals) {
            sparkTransactions.push(currentTotal);
            sparkSuccess.push(Number(currentSuccessPct.toFixed(2)));
            sparkMdr.push(mdrRejections);
            sparkChurn.push(Number(currentChurnPct.toFixed(1)));
          }
        }
        continue;
      }
    }

    // Normal path
    if (rand() < params.baseSuccessRate) {
      counts.SUCCESS++;
    } else {
      const failType = failureStatuses[Math.floor(rand() * failureStatuses.length)];
      counts[failType] = (counts[failType] || 0) + 1;
    }
    totalGenerated++;

    if (totalGenerated % checkpointSize < 2 || totalGenerated >= params.totalTransactions) {
      const currentTotal = totalGenerated;
      const currentSuccessPct = (counts.SUCCESS / (currentTotal || 1)) * 100;
      const currentChurnPct = mdrRejections > 0 ? (churnedUsers / mdrRejections) * 100 : 62.8;
      if (sparkTransactions.length < intervals) {
        sparkTransactions.push(currentTotal);
        sparkSuccess.push(Number(currentSuccessPct.toFixed(2)));
        sparkMdr.push(mdrRejections);
        sparkChurn.push(Number(currentChurnPct.toFixed(1)));
      }
    }
  }

  // Ensure sparklines have 8 points
  while (sparkTransactions.length < intervals) {
    sparkTransactions.push(totalGenerated);
    sparkSuccess.push(Number(((counts.SUCCESS / totalGenerated) * 100).toFixed(2)));
    sparkMdr.push(mdrRejections);
    sparkChurn.push(mdrRejections > 0 ? Number(((churnedUsers / mdrRejections) * 100).toFixed(1)) : 62.8);
  }

  const actualTotal = totalGenerated;
  const successPct = Number(((counts.SUCCESS / actualTotal) * 100).toFixed(2));
  const insufficientPct = Number(((counts.INSUFFICIENT_BALANCE / actualTotal) * 100).toFixed(2));
  const timeoutPct = Number(((counts.TIMEOUT / actualTotal) * 100).toFixed(2));
  const networkPct = Number(((counts.NETWORK_ERROR / actualTotal) * 100).toFixed(2));
  const mdrPct = Number(((counts.MERCHANT_CC_REJECTED / actualTotal) * 100).toFixed(2));

  const totalFailures = actualTotal - counts.SUCCESS;
  const mdrShareOfFailures = totalFailures > 0 ? Number(((counts.MERCHANT_CC_REJECTED / totalFailures) * 100).toFixed(1)) : 0;

  const actualChurnRate = mdrRejections > 0 ? Number(((churnedUsers / mdrRejections) * 100).toFixed(1)) : 0;
  const actualRetentionRate = mdrRejections > 0 ? Number(((retainedUsers / mdrRejections) * 100).toFixed(1)) : 0;

  const statusDistribution: StatusRow[] = [
    { key: "success", label: "SUCCESS", count: counts.SUCCESS, pct: successPct, color: "#22c99a" },
    { key: "insufficient", label: "INSUFFICIENT_BALANCE", count: counts.INSUFFICIENT_BALANCE, pct: insufficientPct, color: "#60a5fa" },
    { key: "timeout", label: "TIMEOUT", count: counts.TIMEOUT, pct: timeoutPct, color: "#f5a524" },
    { key: "network", label: "NETWORK_ERROR", count: counts.NETWORK_ERROR, pct: networkPct, color: "#7c8299" },
    { key: "mdr", label: "MERCHANT_CC_REJECTED", count: counts.MERCHANT_CC_REJECTED, pct: mdrPct, color: "#ec4899", highlight: true },
  ];

  const churnByFailure: ChurnRow[] = [
    { label: "Merchant CC Rejected", churn: actualChurnRate, level: "highest" },
    { label: "Timeout", churn: Number((22 + rand() * 4).toFixed(1)), level: "medium" },
    { label: "Network Error", churn: Number((19 + rand() * 4).toFixed(1)), level: "medium" },
    { label: "Insufficient Balance", churn: Number((10 + rand() * 3).toFixed(1)), level: "lower" },
  ];

  const postRejection = [
    { name: "Churned", value: actualChurnRate, users: churnedUsers, color: "#f0476a" },
    { name: "Retained", value: actualRetentionRate, users: retainedUsers, color: "#22c99a" },
  ];

  const keyFindings: Finding[] = [
    {
      insight: "MDR Rejections",
      metric: `${mdrPct}% of all transactions (${counts.MERCHANT_CC_REJECTED.toLocaleString()})`,
      impact: "High downstream impact",
      status: "Needs attention",
      tone: "warning",
    },
    {
      insight: "Failure Contribution",
      metric: `${mdrShareOfFailures}% of failed transactions`,
      impact: "Major non-technical failure source",
      status: "Investigate",
      tone: "warning",
    },
    {
      insight: "Post-Rejection Churn",
      metric: `${actualChurnRate}% (${churnedUsers.toLocaleString()} users)`,
      impact: "Primary product opportunity",
      status: actualChurnRate > 50 ? "Critical" : "High",
      tone: "danger",
    },
    {
      insight: "Organic Fallback",
      metric: `${actualRetentionRate}% (${retainedUsers.toLocaleString()} users)`,
      impact: "Users discover workaround without guidance",
      status: "Opportunity",
      tone: "opportunity",
    },
  ];

  const duration = performance.now() - startTime;

  return {
    params,
    seed,
    totalTransactions: actualTotal,
    successCount: counts.SUCCESS,
    successRate: successPct,
    mdrCount: counts.MERCHANT_CC_REJECTED,
    mdrRate: mdrPct,
    retainedCount: retainedUsers,
    churnedCount: churnedUsers,
    churnRate: actualChurnRate,
    retentionRate: actualRetentionRate,
    mdrShareOfFailures,
    statusDistribution,
    churnByFailure,
    postRejection,
    spark: {
      transactions: sparkTransactions,
      success: sparkSuccess,
      mdr: sparkMdr,
      churn: sparkChurn,
    },
    keyFindings,
    runDurationMs: Math.round(duration * 10) / 10,
    timestamp: new Date().toLocaleTimeString("en-IN", { hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit" }),
  };
}
