DELETE FROM audit_change
WHERE audit_event_id IN (
  SELECT id
  FROM audit_event
  WHERE package_code = '@voyzu/ice-creams'
);

DELETE FROM audit_event
WHERE package_code = '@voyzu/ice-creams';
