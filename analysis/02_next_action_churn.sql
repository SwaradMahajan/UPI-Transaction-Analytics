-- Next-Action Churn Analysis (Core Technical Deliverable)
-- Uses LEAD() window function to determine what users do after an MDR rejection
-- Key insight: What % of users abandon vs. retry after MERCHANT_CC_REJECTED?

USE upi_analytics;

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
