CREATE TABLE IF NOT EXISTS depenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    montant REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    categorie_id INTEGER NOT NULL,
    mode_paiement TEXT NOT NULL,
    cree_le TEXT DEFAULT CURRENT_TIMESTAMP,
    mis_a_jour_le TEXT DEFAULT CURRENT_TIMESTAMP
);