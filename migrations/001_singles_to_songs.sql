-- Migration: rename `singles` table to `songs` and add a `category` column
-- so a song can be a "Single" or a "New Release".
--
-- Run this against the database the server connects to (see DATABASE_HOST /
-- DATABASE_NAME in your .env or Heroku config vars).

RENAME TABLE singles TO songs;

ALTER TABLE songs
	ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'Single' AFTER code;

-- One-off data move requested for this change: move "Chunga's Revenge - Live"
-- from Singles to New Releases. Adjust the name match if it doesn't line up
-- exactly with what's in the table.
UPDATE songs
SET category = 'New Release'
WHERE name = "Chunga's Revenge - Live";
