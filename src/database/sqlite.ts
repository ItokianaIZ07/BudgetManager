import { AppMetaData } from "@/models/AppMetaData";
import * as SQLite from "expo-sqlite";

export const initDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS categorie (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        libelle TEXT NOT NULL UNIQUE
      );

      CREATE TABLE IF NOT EXISTS depenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        montant REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        categorie_id INTEGER NOT NULL,
        mode_paiement TEXT NOT NULL,
        cree_le TEXT DEFAULT CURRENT_TIMESTAMP,
        mis_a_jour_le TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (categorie_id) REFERENCES categorie(id)
      );

      CREATE TABLE IF NOT EXISTS app_metadata(
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      INSERT OR IGNORE INTO app_metadata(key, value) VALUES ('database_initialized', 'false');

      CREATE TABLE IF NOT EXISTS limite_depense(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categorie_id INTEGER NOT NULL,
        limite REAL NOT NULL,
        FOREIGN KEY (categorie_id) REFERENCES categorie(id)
      );
    `);

    const result = await db.getFirstAsync<AppMetaData>(
      "SELECT value FROM app_metadata WHERE key='database_initialized'"
    );

    if (result?.value === "false") {
      console.log("Insertion des données de départ dans la base de données...");

      await db.withTransactionAsync(async () => {
        await db.runAsync(`
          INSERT OR IGNORE INTO categorie (id, libelle) VALUES
          (1, 'Alimentation'),
          (2, 'Transport'),
          (3, 'Loisirs'),
          (4, 'Crédit'),
          (5, 'Autre');
        `);

        await db.runAsync(`
          INSERT OR IGNORE INTO limite_depense(categorie_id, limite) VALUES
          (1, 500000),
          (2, 1000000),
          (3, 50000),
          (4, 150000),
          (5, 250000);
        `);

        await db.runAsync(
          "UPDATE app_metadata SET value='true' WHERE key='database_initialized'"
        );
      });

      console.log("Données de départ insérées avec succès !");
    }

    console.log("Base de données SQLite prête à l'emploi.");
  } catch (error) {
    console.error("Erreur d'initialisation de la base de données :", error);
  }
};

export const resetDatabase = async (db: SQLite.SQLiteDatabase): Promise<void> => {
  const tables = ["limite_depense", "depenses", "categorie", "app_metadata"];
  for (const table of tables) {
    await db.runAsync(`DROP TABLE IF EXISTS ${table}`);
  }
  console.log("Base de données réinitialisée.");
};