import * as SQLite from "expo-sqlite";

export let isInitialized = false;

export const initializeApplication = async (
  db: SQLite.SQLiteDatabase,
  onReady?: () => Promise<void>
): Promise<void> => {
  try {
    console.log("Initialisation des configurations de l'application...");

    if (onReady) {
      console.log("Exécution de la méthode onReady...");
      await onReady();
      console.log("Application prête !");
    }

    isInitialized = true;
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'application :", error);
    isInitialized = false;
  }
};