"""
Synthetic UPI Transaction Data Generator
Generates ~10,000 transaction rows with realistic MDR rejection behavior.

Behavioral logic:
- SLICE_CC transactions > ₹2,000 at KIRANA/RETAIL → 40% MERCHANT_CC_REJECTED
- On rejection: 35% retry via SLICE_SAVINGS (retention), 65% no follow-up (churn)
"""

import random
import uuid
from datetime import datetime, timedelta
from faker import Faker
import pymysql

# --- Configuration ---
MYSQL_HOST = "localhost"
MYSQL_USER = "root"
MYSQL_PASSWORD = "baataMS@32"
MYSQL_DB = "slice_upi_analytics"

NUM_USERS = 500
TARGET_TRANSACTIONS = 10000
BATCH_SIZE = 500

PAYMENT_METHODS = ["SLICE_CC", "SLICE_SAVINGS", "UPI_OTHER", "DEBIT_CARD"]
MERCHANT_CATEGORIES = ["KIRANA", "RETAIL", "FOOD_DELIVERY", "ELECTRONICS", "TRAVEL", "ENTERTAINMENT", "GROCERY", "PHARMACY"]
SUCCESS_STATUSES = ["SUCCESS"]
FAILURE_STATUSES = ["TIMEOUT", "INSUFFICIENT_BALANCE", "NETWORK_ERROR"]

fake = Faker("en_IN")
random.seed(42)
Faker.seed(42)


def generate_users(num_users):
    """Generate a pool of fake users."""
    users = []
    for _ in range(num_users):
        user_id = f"USR_{uuid.uuid4().hex[:12].upper()}"
        account_vintage_days = random.randint(7, 1200)
        default_payment_method = random.choice(PAYMENT_METHODS)
        users.append((user_id, account_vintage_days, default_payment_method))
    return users


def generate_transactions(users, target_count):
    """
    Generate transaction rows with MDR rejection + churn/retention logic.
    
    Returns:
        transactions: list of tuples ready for batch insert
        stats: dict with rejection/retention/churn counts
    """
    transactions = []
    stats = {"total": 0, "rejections": 0, "retained": 0, "churned": 0}
    
    # Generate a spread of base timestamps across ~90 days
    base_time = datetime(2025, 1, 1, 8, 0, 0)
    
    while stats["total"] < target_count:
        user = random.choice(users)
        user_id = user[0]
        
        # Random timestamp within a 90-day window
        offset_seconds = random.randint(0, 90 * 24 * 3600)
        txn_time = base_time + timedelta(seconds=offset_seconds)
        
        # Transaction attributes
        payment_method = random.choice(PAYMENT_METHODS)
        merchant_category = random.choice(MERCHANT_CATEGORIES)
        amount = round(random.uniform(50, 15000), 2)
        
        # --- Core MDR rejection logic ---
        if (payment_method == "SLICE_CC"
                and amount > 2000
                and merchant_category in ("KIRANA", "RETAIL")):
            # 40% chance of merchant rejecting due to MDR
            if random.random() < 0.40:
                txn_id = f"TXN_{uuid.uuid4().hex[:16].upper()}"
                transactions.append((
                    txn_id, user_id, txn_time, merchant_category,
                    amount, payment_method, "MERCHANT_CC_REJECTED"
                ))
                stats["total"] += 1
                stats["rejections"] += 1
                
                # Fork: 35% retention, 65% churn
                if random.random() < 0.35:
                    # Retained — user retries via SLICE_SAVINGS within 15-60 sec
                    retry_delay = random.randint(15, 60)
                    retry_time = txn_time + timedelta(seconds=retry_delay)
                    retry_txn_id = f"TXN_{uuid.uuid4().hex[:16].upper()}"
                    transactions.append((
                        retry_txn_id, user_id, retry_time, merchant_category,
                        amount, "SLICE_SAVINGS", "SUCCESS"
                    ))
                    stats["total"] += 1
                    stats["retained"] += 1
                else:
                    # Churned — no follow-up transaction
                    stats["churned"] += 1
                
                continue
        
        # --- Normal transaction (non-MDR path) ---
        txn_id = f"TXN_{uuid.uuid4().hex[:16].upper()}"
        
        # 85% success, 15% various failures
        if random.random() < 0.85:
            status = "SUCCESS"
        else:
            status = random.choice(FAILURE_STATUSES)
        
        transactions.append((
            txn_id, user_id, txn_time, merchant_category,
            amount, payment_method, status
        ))
        stats["total"] += 1
    
    return transactions, stats


def insert_batch(cursor, table, columns, rows, batch_size):
    """Insert rows in batches for performance."""
    placeholders = ", ".join(["%s"] * len(columns))
    col_names = ", ".join(columns)
    sql = f"INSERT INTO {table} ({col_names}) VALUES ({placeholders})"
    
    for i in range(0, len(rows), batch_size):
        batch = rows[i:i + batch_size]
        cursor.executemany(sql, batch)


def main():
    print("=" * 60)
    print("  Slice UPI Analytics — Synthetic Data Generator")
    print("=" * 60)
    
    # Connect to MySQL
    conn = pymysql.connect(
        host=MYSQL_HOST,
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        database=MYSQL_DB,
        charset="utf8mb4"
    )
    cursor = conn.cursor()
    
    # Clear existing data (for re-runs)
    cursor.execute("DELETE FROM Transactions")
    cursor.execute("DELETE FROM Users")
    conn.commit()
    print("\n[1/4] Cleared existing data.")
    
    # Generate & insert users
    users = generate_users(NUM_USERS)
    insert_batch(cursor, "Users",
                 ["user_id", "account_vintage_days", "default_payment_method"],
                 users, BATCH_SIZE)
    conn.commit()
    print(f"[2/4] Inserted {len(users)} users.")
    
    # Generate & insert transactions
    transactions, stats = generate_transactions(users, TARGET_TRANSACTIONS)
    insert_batch(cursor, "Transactions",
                 ["transaction_id", "user_id", "transaction_time",
                  "merchant_category", "amount", "payment_method_attempted", "status"],
                 transactions, BATCH_SIZE)
    conn.commit()
    print(f"[3/4] Inserted {len(transactions)} transactions in batches of {BATCH_SIZE}.")
    
    # Verify
    cursor.execute("SELECT COUNT(*) FROM Transactions")
    db_count = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM Users")
    user_count = cursor.fetchone()[0]
    
    print(f"[4/4] Verification — DB row counts: Users={user_count}, Transactions={db_count}")
    
    # Summary
    print("\n" + "=" * 60)
    print("  DATA GENERATION SUMMARY")
    print("=" * 60)
    print(f"  Total transactions inserted : {stats['total']}")
    print(f"  MERCHANT_CC_REJECTED count  : {stats['rejections']}")
    print(f"  Retained (retry success)    : {stats['retained']}")
    print(f"  Churned (no follow-up)      : {stats['churned'] }")
    print(f"  Retention rate              : {stats['retained'] / stats['rejections'] * 100:.1f}%")
    print(f"  Churn rate                  : {stats['churned'] / stats['rejections'] * 100:.1f}%")
    print("=" * 60)
    
    cursor.close()
    conn.close()


if __name__ == "__main__":
    main()
