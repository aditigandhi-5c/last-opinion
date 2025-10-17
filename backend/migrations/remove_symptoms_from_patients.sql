-- Migration: Remove symptoms column from patients table
-- Date: 2024-01-15
-- Description: Move symptoms from patients table to cases table (medical_background)

-- Remove the symptoms column from patients table
ALTER TABLE patients DROP COLUMN IF EXISTS symptoms;

-- Note: Symptoms are now handled in the cases table via the medical_background field
-- which is populated from the questionnaire form that includes both symptoms and additional info







