-- Add priority column to citizen_aspirations table

ALTER TABLE citizen_aspirations
ADD COLUMN priority ENUM('Tinggi', 'Sedang', 'Rendah') DEFAULT 'Sedang' AFTER category;
