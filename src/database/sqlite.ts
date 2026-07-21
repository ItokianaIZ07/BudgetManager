import * as SQLite from 'expo-sqlite';

// Ouverture ou création du fichier de base de données locale
export const db = SQLite.openDatabaseSync('budget_manager.db');

// Fonction qui crée la table si elle n'existe pas encore
export const initDatabase = async (): Promise<void> => {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

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
    `);
    console.log('Base de données SQLite initialisée avec succès !');
  } catch (error) {
    console.error('Erreur d\'initialisation SQLite :', error);
  }
};