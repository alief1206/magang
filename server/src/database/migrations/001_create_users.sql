CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kelurahan_id INT NULL,
  name TEXT NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('warga', 'admin', 'lurah') NOT NULL DEFAULT 'warga',
  address TEXT NULL,
  phone TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_kelurahan
    FOREIGN KEY (kelurahan_id) REFERENCES kelurahans(id)
    ON DELETE SET NULL,
  INDEX idx_users_kelurahan (kelurahan_id),
  INDEX idx_users_role (role)
);
