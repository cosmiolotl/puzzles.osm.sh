-- Correct submissions, one row per (issue, name). Nothing else is stored.
CREATE TABLE IF NOT EXISTS solves (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  issue TEXT NOT NULL,
  name TEXT NOT NULL,
  name_key TEXT NOT NULL,
  solved_at TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS solves_issue_name ON solves (issue, name_key);
CREATE INDEX IF NOT EXISTS solves_issue_time ON solves (issue, solved_at);
