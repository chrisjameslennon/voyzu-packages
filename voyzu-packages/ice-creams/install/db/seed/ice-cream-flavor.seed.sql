INSERT INTO ice_cream_flavor (code, name)
VALUES
  ('VANILLA', 'Vanilla'),
  ('CHOCOLATE', 'Chocolate'),
  ('STRAWBERRY', 'Strawberry'),
  ('MINT_CHOCOLATE', 'Mint Chocolate Chip'),
  ('HOKEY_POKEY', 'Hokey Pokey'),
  ('MATCHA', 'Matcha'),
  ('BLACK_SESAME', 'Black Sesame'),
  ('UBE', 'Ube'),
  ('LAVENDER_HONEY', 'Lavender Honey'),
  ('GOAT_CHEESE_FIG', 'Goat Cheese and Fig'),
  ('WASABI', 'Wasabi'),
  ('BLUE_CHEESE_PEAR', 'Blue Cheese and Pear'),
  ('CHARCOAL_COCONUT', 'Charcoal Coconut'),
  ('SAFFRON_ROSE', 'Saffron Rose'),
  ('SWEET_CORN', 'Sweet Corn')
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    status = 'ACTIVE';
