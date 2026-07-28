ALTER TABLE citizen_aspirations
  MODIFY COLUMN status ENUM('baru', 'diproses', 'menunggu_tanggapan', 'ditanggapi', 'selesai', 'ditolak', 'diteruskan_ke_lurah') NOT NULL DEFAULT 'baru';

CREATE TABLE IF NOT EXISTS aspiration_forwarding_histories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aspiration_id INT NOT NULL,
  forwarded_by INT NULL,
  recipient_role ENUM('lurah') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_aspiration_forwarding_history_aspiration
    FOREIGN KEY (aspiration_id) REFERENCES citizen_aspirations(id) ON DELETE CASCADE,
  CONSTRAINT fk_aspiration_forwarding_history_user
    FOREIGN KEY (forwarded_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_aspiration_forwarding_history_aspiration (aspiration_id)
);

CREATE TABLE IF NOT EXISTS aspiration_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aspiration_id INT NOT NULL,
  kelurahan_id INT NOT NULL,
  recipient_role ENUM('lurah') NOT NULL,
  message VARCHAR(255) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_aspiration_notification_aspiration
    FOREIGN KEY (aspiration_id) REFERENCES citizen_aspirations(id) ON DELETE CASCADE,
  CONSTRAINT fk_aspiration_notification_kelurahan
    FOREIGN KEY (kelurahan_id) REFERENCES kelurahans(id) ON DELETE CASCADE,
  INDEX idx_aspiration_notification_lurah (kelurahan_id, recipient_role, is_read)
);
