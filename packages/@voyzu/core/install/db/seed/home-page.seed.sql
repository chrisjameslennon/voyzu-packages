INSERT INTO voyzu_settings (code, value)
VALUES ('HOME_PAGE_ROUTE', '/organization/companies')
ON CONFLICT (code) DO UPDATE
SET value = EXCLUDED.value;
