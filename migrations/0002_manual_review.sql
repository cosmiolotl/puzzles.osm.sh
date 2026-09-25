-- Preserve previously published names, while holding every new answer.
ALTER TABLE solves RENAME TO submissions;
ALTER TABLE submissions RENAME COLUMN solved_at TO submitted_at;
ALTER TABLE submissions ADD COLUMN answer TEXT;
ALTER TABLE submissions ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
  CHECK (status IN ('pending', 'approved', 'rejected'));
ALTER TABLE submissions ADD COLUMN reviewed_at TEXT;

UPDATE submissions SET status = 'approved', reviewed_at = submitted_at;
DROP INDEX solves_issue_name;
DROP INDEX solves_issue_time;
CREATE UNIQUE INDEX submissions_issue_name_answer
  ON submissions (issue, name_key, COALESCE(answer, ''));
CREATE INDEX submissions_review ON submissions (status, id);
CREATE INDEX submissions_public ON submissions (issue, status, submitted_at);
