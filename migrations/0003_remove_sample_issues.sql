-- Run before publishing the replacement September issue: these rows belong
-- to the three temporary issues, not the new image puzzle.
DELETE FROM submissions WHERE issue IN ('2026-07', '2026-08', '2026-09');
