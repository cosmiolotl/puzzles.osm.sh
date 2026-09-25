-- Preserve the image puzzle's submissions when its issue moves to August.
-- Apply before deploying the knight puzzle as the new September issue.
UPDATE submissions SET issue = '2026-08' WHERE issue = '2026-09';
