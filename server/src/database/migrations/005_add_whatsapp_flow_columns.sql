ALTER TABLE kelurahans
  ADD COLUMN IF NOT EXISTS lurah_name TEXT NULL AFTER code,
  ADD COLUMN IF NOT EXISTS lurah_whatsapp_number TEXT NULL AFTER lurah_name;

ALTER TABLE chat_conversations
  ADD COLUMN IF NOT EXISTS forwarded_to_lurah_phone TEXT NULL AFTER subject,
  ADD COLUMN IF NOT EXISTS forwarded_to_lurah_at TIMESTAMP NULL DEFAULT NULL AFTER forwarded_to_lurah_phone;

ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS source ENUM('web', 'whatsapp') NOT NULL DEFAULT 'web' AFTER message,
  ADD COLUMN IF NOT EXISTS external_message_id VARCHAR(150) NULL AFTER source;

ALTER TABLE citizen_aspirations
  ADD COLUMN IF NOT EXISTS source ENUM('web', 'whatsapp') NOT NULL DEFAULT 'web' AFTER compression_status,
  ADD COLUMN IF NOT EXISTS whatsapp_sender_phone TEXT NULL AFTER source,
  ADD COLUMN IF NOT EXISTS whatsapp_message_id VARCHAR(150) NULL AFTER whatsapp_sender_phone;

ALTER TABLE aspiration_responses
  ADD COLUMN IF NOT EXISTS source ENUM('web', 'whatsapp') NOT NULL DEFAULT 'web' AFTER response,
  ADD COLUMN IF NOT EXISTS external_message_id VARCHAR(150) NULL AFTER source;
