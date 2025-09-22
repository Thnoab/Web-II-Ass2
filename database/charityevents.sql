-- charityevents.sql
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- 组织表
CREATE TABLE organizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  contact_email VARCHAR(200),
  contact_phone VARCHAR(50),
  website VARCHAR(255)
);

-- 活动类别表
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- 活动表
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_description VARCHAR(500),
  description TEXT,
  location VARCHAR(255),
  date DATE,
  start_time TIME NULL,
  end_time TIME NULL,
  price DECIMAL(10,2) DEFAULT 0.00,
  goal DECIMAL(12,2) DEFAULT 0.00,
  progress DECIMAL(12,2) DEFAULT 0.00,
  category_id INT,
  org_id INT,
  suspended BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

-- 票种表————————————————————
CREATE TABLE tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT,
  name VARCHAR(150),
  price DECIMAL(10,2),
  quantity INT DEFAULT 0,
  sold INT DEFAULT 0,
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- ——————————————————————————以上部分的内容属于额外添加的，若不可，遂除

-- 插入示例组织
INSERT INTO organizations (name, description, contact_email, contact_phone, website) VALUES
('City Care Foundation', 'Local charity focusing on health and elderly care', 'info@citycare.org', '012-345-6789', 'https://citycare.example'),
('GreenFuture Org', 'Environmental protection and community green projects', 'hello@greenfuture.org', '012-222-3333', 'https://greenfuture.example');

-- 插入类别
INSERT INTO categories (name) VALUES
('Procession'),
('Proposal'),
('Auction'),
('Concert'),
('Propaganda');

-- 插入 8 条事件
INSERT INTO events (name, short_description, description, location, date, start_time, price, goal, progress, category_id, org_id, image_url) VALUES
('Procession 2025', '5km charity procession for children in Gaza', 'Let the world hear your voice,from the river to the sea.', 'Central Park', '2025-09-20', '09:00:00', 20.00, 5000.00, 1200.00, 1, 1, ''),
('Autumn Charity Gala', 'Formal dinner supporting cancer research', 'A black-tie gala dinner with speeches and live music to raise funds for cancer research.', 'Grand Town Hall', '2025-10-05', '19:00:00', 120.00, 20000.00, 8000.00, 2, 1, ''),
('Silent Art Auction', 'Auction of donated artworks', 'Bid on donated artworks. Proceeds go to community art programs.', 'Community Center', '2025-10-12', '18:00:00', 0.00, 10000.00, 3000.00, 3, 2, ''),
('Music for Hope', 'Benefit concert with local bands', 'Local bands perform to raise funds for youth music education.', 'City Arena', '2025-11-01', '18:30:00', 35.00, 15000.00, 6000.00, 4, 2, ''),
('Community Propaganda', 'Incitement of fundraising activities', 'Promote donations by speeches.', 'University', '2025-09-10', '10:00:00', 0.00, 2000.00, 450.00, 5, 1, ''),
('Charity Bike Ride', '20km ride raising awareness', 'A family-friendly bike ride along the river. Sponsor per rider.', 'Riverside Park', '2025-10-20', '08:30:00', 15.00, 8000.00, 1500.00, 1, 1, ''),
('Green Proposal', 'Eco-friendly fundraising proposal', 'A green-themed proposal supporting desert greening initiatives.', 'Rooftop Hall', '2025-11-15', '19:00:00', 95.00, 12000.00, 2000.00, 2, 2, ''),
('Youth Talent Auction', 'Auction of performance slots', 'Bid for slots in a youth talent night — proceeds support youth programs.', 'Youth Center', '2025-12-01', '17:00:00', 0.00, 3000.00, 100.00, 3, 1, '');
