CREATE TABLE IF NOT EXISTS categorie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    libelle TEXT
);

INSERT OR IGNORE INTO categorie (id, libelle) VALUES
(1, 'Alimentation'),
(2, 'Transport'),
(3, 'Loisirs'),
(4, 'Crédit'),
(5, 'Autre');

CREATE TABLE IF NOT EXISTS depenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    montant REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    categorie_id INTEGER NOT NULL,
    mode_paiement TEXT NOT NULL,
    cree_le TEXT DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_le TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY categorie_id REFERENCES categorie(id)
);

CREATE TABLE IF NOT EXISTS app_metadata(
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

INSERT OR IGNORE INTO app_metadata(key, value) VALUES
('database_initialized', 'false');

CREATE TABLE IF NOT EXISTS limite_depense(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categorie_id INTEGER NOT NULL,
    limite REAL NOT NULL,
    FOREIGN KEY (categorie_id) REFERENCES categorie(id)
);

INSERT INTO OR IGNORE limite_depense(categorie_id, limite) VALUES
(1, 500000),
(2, 1000000),
(3, 50000),
(4, 150000),
(5, 250000);