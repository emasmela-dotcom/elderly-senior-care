-- Run in Neon SQL Editor ONLY if tables are missing or partially created.
-- WARNING: Drops all app data, then recreates tables from scratch.

DROP TABLE IF EXISTS medications CASCADE;
DROP TABLE IF EXISTS vital_signs CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS symptom_logs CASCADE;
DROP TABLE IF EXISTS health_records CASCADE;
DROP TABLE IF EXISTS residents CASCADE;
DROP TABLE IF EXISTS caregivers CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS safety_incidents CASCADE;

-- Then paste and run the full contents of db/schema.sql
