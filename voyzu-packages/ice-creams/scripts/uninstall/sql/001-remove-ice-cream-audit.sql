DELETE FROM audit_change
WHERE audit_event_id IN (
  SELECT id
  FROM audit_event
  WHERE entity_type IN ('ice_cream', 'ice_cream_flavor')
);

DELETE FROM audit_event
WHERE entity_type IN ('ice_cream', 'ice_cream_flavor');
