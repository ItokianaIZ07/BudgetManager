import { AppMetaData } from '@/models/AppMetaData';
import * as SQLite from 'expo-sqlite';

// Ouverture ou création du fichier de base de données locale
export const db = SQLite.openDatabaseSync('budget_manager.db');

// Fonction qui crée la table si elle n'existe pas encore
export const initDatabase = async (): Promise<void> => {
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

      INSERT OR IGNORE INTO app_metadata(key, value) VALUES
      ('database_initialized', 'false');
    `);
    console.log('Base de données SQLite initialisée avec succès !');
  } catch (error) {
    console.error('Erreur d\'initialisation SQLite :', error);
  }
};

const initCategoryData = async (): Promise<void> => {
  try{
    await db.runAsync(`
      INSERT OR IGNORE INTO categorie (id, libelle) VALUES
      (1, 'Alimentation'),
      (2, 'Transport'),
      (3, 'Loisirs'),
      (4, 'Crédit'),
      (5, 'Autre');
    `);
    console.log("Donnée inserer avec succès !");
  }catch(error){
    const message = `Erreur lors de l\'insertion des données de categorie : ${error}`;
    throw message;
  }
}

export const isInitalized = () =>{
  try{
    const result = db.getFirstSync<AppMetaData>("SELECT value FROM app_metadata WHERE key='database_initialized'");
    return result != null ? result.value : null;
  }catch(error){
    console.error("Une erreur est survenue lors de la vérification de la table app_metadata",error)
  }
}

export const initializeData = async ()=>{
  try{
    await initCategoryData();
    const requete = "UPDATE app_metadata SET value='true' WHERE key='database_initialized'";
    await db.runAsync(requete);
  }catch(error){
    console.error(error);
  }
}

export const resetDatabase = async () =>{
  const requete = `DROP TABLE IF EXISTS`; 
  const tables = ['categorie', 'depenses', 'app_metadata'];
  for(const table of tables){
    await db.runAsync(`${requete} ${table}`);
  }
}