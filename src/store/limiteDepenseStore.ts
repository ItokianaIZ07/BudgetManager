import { LimiteDepense } from "@/models/LimiteDepense";
import { LimiteDepenseRepository } from "@/repositories/LimiteDepenseRepository";
import type { SQLiteDatabase } from "expo-sqlite";
import { create } from "zustand";

interface LimiteDepenseStoreState {
  limites: LimiteDepense[];
  loading: boolean;
  error: string | null;
  setLimites: (limites: LimiteDepense[]) => void;
  fetchLimites: (db: SQLiteDatabase) => Promise<void>;
  createLimite: (
    db: SQLiteDatabase,
    limite: Omit<LimiteDepense, "id">,
  ) => Promise<number>;
  updateLimite: (db: SQLiteDatabase, limite: LimiteDepense) => Promise<void>;
  deleteParCategorie: (
    db: SQLiteDatabase,
    idCategorie: number,
  ) => Promise<void>;
}

export const useLimiteDepenseStore = create<LimiteDepenseStoreState>((set) => ({
  limites: [],
  loading: false,
  error: null,

  setLimites: (limites) => set({ limites }),

  fetchLimites: async (db) => {
    set({ loading: true, error: null });
    try {
      const limites = await LimiteDepenseRepository.recuperTous(db);
      set({ limites, loading: false });
    } catch (error) {
      console.error("Erreur lors du chargement des limites :", error);
      set({ error: "Impossible de charger les limites", loading: false });
    }
  },

  createLimite: async (db, limite) => {
    try {
      const id = await LimiteDepenseRepository.sauvegarderLimite(db, limite);
      set((state) => ({ limites: [...state.limites, { ...limite, id }] }));
      return id;
    } catch (error) {
      console.error("Erreur lors de la création de la limite :", error);
      throw error;
    }
  },

  updateLimite: async (db, limite) => {
    try {
      await LimiteDepenseRepository.mettreAJourLimite(db, {
        id: limite.idCategorie,
        libelle: "",
        limite: limite.limite,
      } as any);
      set((state) => ({
        limites: state.limites.map((l) => (l.id === limite.id ? limite : l)),
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la limite :", error);
      throw error;
    }
  },

  deleteParCategorie: async (db, idCategorie) => {
    try {
      await LimiteDepenseRepository.supprimerParCategorie(db, idCategorie);
      set((state) => ({
        limites: state.limites.filter((l) => l.idCategorie !== idCategorie),
      }));
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de la limite par catégorie :",
        error,
      );
      throw error;
    }
  },
}));

export default useLimiteDepenseStore;
