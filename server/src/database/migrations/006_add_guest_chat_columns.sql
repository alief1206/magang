ALTER TABLE chat_conversations
  ADD COLUMN IF NOT EXISTS guest_name VARCHAR(255) NULL AFTER citizen_id;

ALTER TABLE chat_messages
  ADD COLUMN IF NOT EXISTS guest_sender_name VARCHAR(255) NULL AFTER sender_id;
