USE P13_crowdfunding_db;

-- 1. Insert roles
INSERT INTO ROLE (rname) VALUES 
('Admin'), 
('Campaign Creator'), 
('Donor');

-- 2. Insert categories
INSERT INTO CATEGORY (cname) VALUES 
('Healthcare'), 
('Natural Disaster'), 
('Education');

-- 3. Insert users
INSERT INTO USER (uname, email, adhar_no, phone_no, role_id, password) VALUES 
('Admin User', 'admin@example.com', '123456789012', '9876543210', 1, SHA2('admin123', 256)),
('Rahul Sharma', 'rahul@example.com', '234567890123', '8765432109', 2, SHA2('creator123', 256)),
('Priya Patel', 'priya@example.com', '345678901234', '7654321098', 2, SHA2('creator456', 256)),
('Amit Singh', 'amit@example.com', '456789012345', '6543210987', 3, SHA2('donor123', 256)),
('Neha Gupta', 'neha@example.com', '567890123456', '9432109876', 3, SHA2('donor456', 256));

-- 4. Insert wallet data (user_id must exist, campaign_id can be NULL for now)
INSERT INTO WALLET (user_id, campaign_id, amount, cur_balance, creation_date) VALUES 
(2, NULL, 5000, 5000, '2023-01-10'),
(3, NULL, 15000, 15000, '2023-03-25');

-- 5. Insert documents (campaign_id can be NULL for now)
INSERT INTO DOCUMENTS (campaign_id, documents) VALUES
(NULL, NULL),
(NULL, NULL);

-- 6. Insert campaigns (wallet_id and document_id must exist)
-- Use the actual wallet_id and document_id from previous inserts
INSERT INTO CAMPAIGN (user_id, title, category_id, start_date, end_date, target_amt, status, wallet_id, document_id) VALUES 
(2, 'Help for Cancer Treatment', 1, '2023-01-15', '2023-06-15', 500000, 'completed', 1, 1),
(3, 'Flood Relief in Kerala', 2, '2023-04-01', '2023-09-30', 2000000, 'active', 2, 2);

-- 7. Update wallet and documents with campaign_id
UPDATE WALLET SET campaign_id = 1 WHERE wallet_id = 1;
UPDATE WALLET SET campaign_id = 2 WHERE wallet_id = 2;
UPDATE DOCUMENTS SET campaign_id = 1 WHERE document_id = 1;
UPDATE DOCUMENTS SET campaign_id = 2 WHERE document_id = 2;

-- 8. Insert donations
INSERT INTO DONATION (amount, campaignid, wallet_id) VALUES 
(5000, 1, 1),
(10000, 1, 1),
(15000, 2, 2);

-- 9. Insert success stories
INSERT INTO SUCCESS_STORIES (updates, images, fund_raised) VALUES 
('Raised ₹5,00,000 for cancer treatment', NULL, 500000),
('Helped 100 flood-affected families', NULL, 1500000);

-- 10. Insert comments
INSERT INTO COMMENT (campaign_id, user_id, text) VALUES 
(1, 4, 'Happy to support this cause!'),
(1, 5, 'When will the next update be shared?'),
(2, 4, 'This is a great initiative for flood victims');

-- 11. Insert feedback
INSERT INTO FEEDBACK (user_id, message, rating) VALUES 
(4, 'Good platform, easy to use', 4),
(5, 'Could improve campaign updates', 3);