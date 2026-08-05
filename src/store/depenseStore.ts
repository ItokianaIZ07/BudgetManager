import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import { Depense } from "@/models/Depense";
import { create } from "zustand";

interface DepenseStoreState {
  depenses: Depense[];
  loading: boolean;
  error: string | null;
  setDepenses: (depenses: Depense[]) => void;
  fetchDepenses: () => Promise<void>;
  fetchDepensesParCategorie: (categorieId: number) => Promise<void>;
  searchByKeyword: (keyword: string) => Promise<void>;
  createDepense: (depense: Omit<Depense, "id">) => Promise<number>;
  updateDepense: (depense: Depense) => Promise<void>;
  deleteDepense: (id: number) => Promise<void>;
  deleteAll: () => Promise<void>;
}

export const useDepenseStore = create<DepenseStoreState>((set, get) => ({
  depenses: [],
  loading: false,
  error: null,

  setDepenses: (depenses) => set({ depenses }),

  fetchDepenses: async () => {
    set({ loading: true, error: null });

    try {
      const depenses = await DepenseRepository.recupererToutes();
      set({ depenses, loading: false });
    } catch (error) {
      console.error("Erreur lors du chargement des dépenses :", error);
      set({ error: "Impossible de charger les dépenses", loading: false });
    }
  },

  fetchDepensesParCategorie: async (categorieId: number) => {
    set({ loading: true, error: null });
    try {
      const donnees =
        await DepenseRepository.recupererParCategorie(categorieId);
      set({ depenses: donnees, loading: false });
    } catch (error) {
      console.error(
        "Erreur lors du chargement des dépenses par catégorie :",
        error,
      );
      set({ error: "Impossible de charger les dépenses", loading: false });
    }
  },

  searchByKeyword: async (keyword: string) => {
    set({ loading: true, error: null });
    try {
      const donnees = await DepenseRepository.rechercherParMotCle(keyword);
      set({ depenses: donnees, loading: false });
    } catch (error) {
      console.error("Erreur lors de la recherche des dépenses :", error);
      set({ error: "Impossible de rechercher", loading: false });
    }
  },

  createDepense: async (depense) => {
    try {
      const id = await DepenseRepository.ajouter(depense);
      await get().fetchDepenses();
      return id;
    } catch (error) {
      console.error("Erreur lors de la création de la dépense :", error);
      throw error;
    }
  },

  updateDepense: async (depense) => {
    if (!depense.id) {
      throw new Error(
        "Impossible de mettre à jour une dépense sans identifiant",
      );
    }

    try {
      await DepenseRepository.mettreAJour(depense);
      await get().fetchDepenses();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la dépense :", error);
      throw error;
    }
  },

  deleteDepense: async (id) => {
    try {
      await DepenseRepository.supprimerDepense(id);
      await get().fetchDepenses();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense :", error);
      throw error;
    }
  },
  deleteAll: async () => {
    try {
      await DepenseRepository.supprimerTout();
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
