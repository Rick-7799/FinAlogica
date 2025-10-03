INSERT INTO users (email, name) VALUES
('demo@finalogica.local', 'Demo User')
ON CONFLICT (email) DO NOTHING;

INSERT INTO species (common_name, scientific_name, label_key, notes) VALUES
('Tench', 'Tinca tinca', 'tench', 'Freshwater'),
('Goldfish', 'Carassius auratus', 'goldfish', 'Freshwater'),
('Great white shark', 'Carcharodon carcharias', 'great_white_shark', 'Saltwater'),
('Sturgeon', 'Acipenser sturio', 'sturgeon', 'Anadromous')
ON CONFLICT (label_key) DO NOTHING;
