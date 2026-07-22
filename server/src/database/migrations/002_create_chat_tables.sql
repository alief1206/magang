CREATE TABLE IF NOT EXISTS chat_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kelurahan_id INT NULL,
  citizen_id INT NULL,
  target_role ENUM('admin', 'lurah') NOT NULL DEFAULT 'admin',
  status ENUM('waiting_response', 'answered', 'closed') NOT NULL DEFAULT 'waiting_response',
  subject TEXT NULL,
  last_message_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_conversations_kelurahan
    FOREIGN KEY (kelurahan_id) REFERENCES kelurahans(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_chat_conversations_citizen
    FOREIGN KEY (citizen_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_chat_conversations_kelurahan (kelurahan_id),
  INDEX idx_chat_conversations_citizen (citizen_id),
  INDEX idx_chat_conversations_target_role (target_role),
  INDEX idx_chat_conversations_status (status)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  sender_id INT NULL,
  sender_role ENUM('warga', 'admin', 'lurah', 'system') NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_chat_messages_conversation
    FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_chat_messages_sender
    FOREIGN KEY (sender_id) REFERENCES users(id)
    ON DELETE SET NULL,
  INDEX idx_chat_messages_conversation (conversation_id),
  INDEX idx_chat_messages_sender (sender_id),
  INDEX idx_chat_messages_sender_role (sender_role)
);
