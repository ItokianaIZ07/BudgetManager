import { Depense } from "@/models/Depense";
import { DepenseRepository } from "@/repositories/DepenseRepository";
import type { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

interface DepenseStoreState {
  depenses: Depense[];
  loading: boolean;
  error: string | null;
  setDepenses: (depenses: Depense[]) => void;
  fetchDepenses: (db: SQLiteDatabase) => Promise<void>;
  fetchDepensesParCategorie: (
    db: SQLiteDatabase,
    categorieId: number,
  ) => Promise<void>;
  searchByKeyword: (db: SQLiteDatabase, keyword: string) => Promise<void>;
  createDepense: (
    db: SQLiteDatabase,
    depense: Omit<Depense, "id">,
  ) => Promise<number>;
  updateDepense: (db: SQLiteDatabase, depense: Depense) => Promise<void>;
  deleteDepense: (db: SQLiteDatabase, id: number) => Promise<void>;
  deleteAll: (db: SQLiteDatabase) => Promise<void>;
}

export const useDepenseStore = create<DepenseStoreState>((set, get) => ({
  depenses: [],
  loading: false,
  error: null,

  setDepenses: (depenses) => set({ depenses }),

  fetchDepenses: async (db) => {
    set({ loading: true, error: null });

    try {
      const depenses = await DepenseRepository.recupererToutes(db);
      set({ depenses, loading: false });
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses :", error);
      set({ error: "Impossible de charger les dépenses", loading: false });
    }
  },

  fetchDepensesParCategorie: async (db, categorieId) => {
    set({ loading: true, error: null });
    try {
      const donnees = await DepenseRepository.recupererParCategorie(
        db,
        categorieId,
      );
      set({ depenses: donnees, loading: false });
    } catch (error) {
      console.error(
        "Erreur lors du chargement des dépenses par catégorie :",
        error,
      );
      set({ error: "Impossible de charger les dépenses", loading: false });
    }
  },

  searchByKeyword: async (db, keyword: string) => {
    set({ loading: true, error: null });
    try {
      const donnees = await DepenseRepository.rechercherParMotCle(db, keyword);
      set({ depenses: donnees, loading: false });
    } catch (error) {
      console.error("Erreur lors de la recherche des dépenses :", error);
      set({ error: "Impossible de rechercher", loading: false });
    }
  },

  createDepense: async (db, depense) => {
    try {
      const id = await DepenseRepository.ajouter(db, depense);
      await get().fetchDepenses(db);
      return id;
    } catch (error) {
      console.error("Erreur lors de la création de la dépense :", error);
      throw error;
    }
  },

  updateDepense: async (db, depense) => {
    if (!depense.id) {
      throw new Error(
        "Impossible de mettre à jour une dépense sans identifiant",
      );
    }

    try {
      await DepenseRepository.mettreAJour(db, depense);
      await get().fetchDepenses(db);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense :", error);
      throw error;
    }
  },

  deleteDepense: async (db, id) => {
    try {
      await DepenseRepository.supprimerDepense(db, id);
      await get().fetchDepenses(db);
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense :", error);
      throw error;
    }
  },
  deleteAll: async (db) => {
    try {
      await DepenseRepository.supprimerTout(db);
      set({ depenses: [] });
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de toutes les dépenses :",
        error,
      );
      throw error;
    }
  },
}));
