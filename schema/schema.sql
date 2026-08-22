-- Slice UPI Analytics - Database Schema
-- Creates the core tables for UPI transaction analysis

CREATE DATABASE IF NOT EXISTS slice_upi_analytics;
USE slice_upi_analytics;

DROP TABLE IF EXISTS Transactions;
DROP TABLE IF EXISTS Users;

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
