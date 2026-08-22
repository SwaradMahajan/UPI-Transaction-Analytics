-- Base Funnel Analysis
-- Shows the volume and percentage breakdown of all transaction statuses

USE slice_upi_analytics;

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
