CREATE TABLE IF NOT EXISTS citizen_aspirations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kelurahan_id INT NULL,
  user_id INT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  short_title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_path VARCHAR(255) NULL,
  image_original_name VARCHAR(255) NULL,
  image_mime_type VARCHAR(100) NULL,
  image_size_bytes INT UNSIGNED NULL,
  compressed_image_path VARCHAR(255) NULL,
  compressed_image_size_bytes INT UNSIGNED NULL,
  compression_status ENUM('pending', 'compressed', 'failed', 'not_needed') NOT NULL DEFAULT 'pending',
  status ENUM('baru', 'diproses', 'menunggu_tanggapan', 'ditanggapi', 'selesai', 'ditolak') NOT NULL DEFAULT 'baru',
  assigned_to_role ENUM('admin', 'lurah') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_citizen_aspirations_kelurahan
    FOREIGN KEY (kelurahan_id) REFERENCES kelurahans(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_citizen_aspirations_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_citizen_aspirations_kelurahan (kelurahan_id),
  INDEX idx_citizen_aspirations_user (user_id),
  INDEX idx_citizen_aspirations_category (category),
  INDEX idx_citizen_aspirations_status (status),
  INDEX idx_citizen_aspirations_assigned_to_role (assigned_to_role)
);

CREATE TABLE IF NOT EXISTS aspiration_responses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aspiration_id INT NOT NULL,
  responder_id INT NULL,
  responder_role ENUM('admin', 'lurah') NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_aspiration_responses_aspiration
    FOREIGN KEY (aspiration_id) REFERENCES citizen_aspirations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_aspiration_responses_responder
    FOREIGN KEY (responder_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_aspiration_responses_aspiration (aspiration_id),
  INDEX idx_aspiration_responses_responder (responder_id)
);
