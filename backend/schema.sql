CREATE DATABASE IF NOT EXISTS military_asset_db;
USE military_asset_db;

-- Bases Table
CREATE TABLE IF NOT EXISTS bases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'BASE_COMMANDER', 'LOGISTICS_OFFICER') NOT NULL,
    base_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE SET NULL
);

-- Equipment Types Table
CREATE TABLE IF NOT EXISTS equipment_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category ENUM('WEAPON', 'VEHICLE', 'AMMUNITION') NOT NULL
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    base_id INT NOT NULL,
    equipment_type_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id) ON DELETE CASCADE
);

-- Transfers Table
CREATE TABLE IF NOT EXISTS transfers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    source_base_id INT NOT NULL,
    destination_base_id INT NOT NULL,
    equipment_type_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    status ENUM('PENDING', 'IN_TRANSIT', 'COMPLETED') DEFAULT 'COMPLETED',
    initiated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_base_id) REFERENCES bases(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_base_id) REFERENCES bases(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id) ON DELETE CASCADE,
    FOREIGN KEY (initiated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Assignments & Expenditures Table
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    base_id INT NOT NULL,
    equipment_type_id INT NOT NULL,
    assigned_quantity INT DEFAULT 0,
    expended_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (base_id) REFERENCES bases(id) ON DELETE CASCADE,
    FOREIGN KEY (equipment_type_id) REFERENCES equipment_types(id) ON DELETE CASCADE
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed Initial Data
INSERT IGNORE INTO bases (id, name, location) VALUES 
(1, 'Fort Alpha', 'Sector 1 - North Zone'),
(2, 'Forward Base Bravo', 'Sector 4 - Outpost Zone');

INSERT IGNORE INTO equipment_types (id, name, category) VALUES 
(1, 'M4A1 Carbine', 'WEAPON'),
(2, 'Humvee (HMMWV)', 'VEHICLE'),
(3, '5.56mm NATO Ammunition', 'AMMUNITION');

INSERT IGNORE INTO users (id, username, password_hash, role, base_id) VALUES 
(1, 'admin_user', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', NULL),
(2, 'commander_alpha', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'BASE_COMMANDER', 1),
(3, 'logistics_officer', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'LOGISTICS_OFFICER', 1);