import {
    initDatabase,
    initializeData,
    isInitalized as isDatabaseInitialized,
} from "./sqlite";

export let isInitalized = false;

export const initializeApplication = async (
  onReady?: () => Promise<void>,
): Promise<void> => {
  try {
    await initDatabase();

    if (isDatabaseInitialized() === "false") {
      await initializeData();
    }

    if (onReady) {
      await onReady();
    }

    isInitalized = true;
  } catch (error) {
    console.error("Erreur au chargement :", error);
    isInitalized = false;
  }
};
