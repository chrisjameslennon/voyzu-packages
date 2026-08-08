INSERT INTO ice_cream (code, name, flavor_id, supplier)
SELECT
  sample.code,
  sample.name,
  flavor.id,
  sample.supplier
FROM (
  VALUES
    ('CLASSIC_VANILLA', 'Classic Vanilla', 'VANILLA', 'Southern Alps Creamery'),
    ('DARK_CHOCOLATE', 'Midnight Chocolate', 'CHOCOLATE', 'North Shore Dairy Foods'),
    ('BERRY_GARDEN', 'Strawberry Garden', 'STRAWBERRY', 'Berry Fields Co-operative'),
    ('KIWI_HOKEY_POKEY', 'Kiwi Hokey Pokey', 'HOKEY_POKEY', 'The Chilly Bin Creamery'),
    ('KYOTO_MATCHA', 'Kyoto Matcha', 'MATCHA', 'Green Whisk Trading'),
    ('SESAME_NIGHT', 'Black Sesame Night', 'BLACK_SESAME', 'Sub-Zero Scoops'),
    ('PURPLE_UBE', 'Purple Ube Dream', 'UBE', 'Manila Frozen Foods'),
    ('LAVENDER_APIARY', 'Lavender Apiary', 'LAVENDER_HONEY', 'Brrr & Bloom'),
    ('FIG_AND_GOAT', 'Fig and Goat Cheese', 'GOAT_CHEESE_FIG', 'Hill Country Dairy'),
    ('WASABI_WAKEUP', 'Wasabi Wake-Up', 'WASABI', 'The Cold Shoulder Company'),
    ('BLUE_PEAR', 'Blue Cheese and Pear', 'BLUE_CHEESE_PEAR', 'Frost & Forage'),
    ('CHARCOAL_TIDE', 'Charcoal Coconut Tide', 'CHARCOAL_COCONUT', 'Black Sand Gelato Works'),
    ('SAFFRON_ROSE', 'Saffron Rose', 'SAFFRON_ROSE', 'Ice to Meet You Ltd'),
    ('SWEET_CORN_SUNDAE', 'Sweet Corn Sundae', 'SWEET_CORN', 'Polar Pantry Provisions')
) AS sample(code, name, flavor_code, supplier)
JOIN ice_cream_flavor flavor
  ON flavor.code = sample.flavor_code
ON CONFLICT (code) DO NOTHING;
