-- Database creation
CREATE DATABASE IF NOT EXISTS P13_crowdfunding_db;
USE P13_crowdfunding_db;

-- ROLE table
CREATE TABLE IF NOT EXISTS ROLE (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    rname VARCHAR(30) NOT NULL UNIQUE
);

-- CATEGORY table
CREATE TABLE IF NOT EXISTS CATEGORY (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    cname VARCHAR(50) NOT NULL UNIQUE
);

-- USER table
CREATE TABLE IF NOT EXISTS USER (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    uname VARCHAR(50) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    adhar_no VARCHAR(12) NOT NULL UNIQUE,
    phone_no VARCHAR(10) NOT NULL UNIQUE,
    role_id INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (role_id) REFERENCES ROLE(role_id)
);

-- WALLET table (campaign_id FK added later)
CREATE TABLE IF NOT EXISTS WALLET (
    wallet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    campaign_id INT,
    amount FLOAT NOT NULL,
    cur_balance FLOAT NOT NULL,
    creation_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

-- DOCUMENTS table (campaign_id FK added later)
CREATE TABLE IF NOT EXISTS DOCUMENTS (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    documents MEDIUMBLOB
);

-- CAMPAIGN table (wallet_id and document_id FK added later)
CREATE TABLE IF NOT EXISTS CAMPAIGN (
    campaign_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(80) NOT NULL,
    category_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_amt FLOAT NOT NULL,
    status VARCHAR(15) DEFAULT 'active',
    wallet_id INT,
    documents MEDIUMBLOB,
    document_id INT,
    FOREIGN KEY (user_id) REFERENCES USER(user_id),
    FOREIGN KEY (category_id) REFERENCES CATEGORY(category_id)
);

-- DONATION table
CREATE TABLE IF NOT EXISTS DONATION (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    amount FLOAT NOT NULL,
    campaignid INT NOT NULL,
    wallet_id INT NOT NULL,
    donation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaignid) REFERENCES CAMPAIGN(campaign_id),
    FOREIGN KEY (wallet_id) REFERENCES WALLET(wallet_id)
);

-- SUCCESS_STORIES table
CREATE TABLE IF NOT EXISTS SUCCESS_STORIES (
    success_id INT AUTO_INCREMENT PRIMARY KEY,
    updates VARCHAR(200) NOT NULL,
    images MEDIUMBLOB,
    fund_raised FLOAT
);

-- COMMENT table
CREATE TABLE IF NOT EXISTS COMMENT (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT NOT NULL,
    user_id INT NOT NULL,
    text VARCHAR(200) NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES CAMPAIGN(campaign_id),
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

-- FEEDBACK table
CREATE TABLE IF NOT EXISTS FEEDBACK (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message VARCHAR(200) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    FOREIGN KEY (user_id) REFERENCES USER(user_id)
);

-- Now add the circular foreign keys
ALTER TABLE WALLET ADD CONSTRAINT fk_wallet_campaign FOREIGN KEY (campaign_id) REFERENCES CAMPAIGN(campaign_id);
ALTER TABLE DOCUMENTS ADD CONSTRAINT fk_documents_campaign FOREIGN KEY (campaign_id) REFERENCES CAMPAIGN(campaign_id);
ALTER TABLE CAMPAIGN ADD CONSTRAINT fk_campaign_wallet FOREIGN KEY (wallet_id) REFERENCES WALLET(wallet_id);
ALTER TABLE CAMPAIGN ADD CONSTRAINT fk_campaign_document FOREIGN KEY (document_id) REFERENCES DOCUMENTS(document_id);