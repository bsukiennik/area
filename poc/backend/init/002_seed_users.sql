-- Local development seed data only.
-- The special account plus 99,999 generated accounts = 100,000 rows.
-- Plaintext is intentionally used only because this is the requested POC.
-- Never store real users' passwords this way.

INSERT INTO users (username, email, password_hash)
VALUES ('user', 'user@test.area', 'area2026');

INSERT INTO users (username, email, password_hash)
SELECT
    'user' || LPAD(n::text, 6, '0'),
    'user' || LPAD(n::text, 6, '0') || '@test.area',
    'area2026'
FROM generate_series(1, 99999) AS n;
