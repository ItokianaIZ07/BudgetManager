import { LimiteDepenseRepository } from "@/app/repositories/LimiteDepenseRepository";
import { LimiteDepense } from "@/models/LimiteDepense";
import { create } from "zustand";

interface LimiteDepenseStoreState {
  limites: LimiteDepense[];
  loading: boolean;
  error: string | null;
  setLimites: (limites: LimiteDepense[]) => void;
  fetchLimites: () => Promise<void>;
  createLimite: (limite: Omit<LimiteDepense, "id">) => Promise<number>;
  updateLimite: (limite: LimiteDepense) => Promise<void>;
  deleteParCategorie: (idCategorie: number) => Promise<void>;
}

export const useLimiteDepenseStore = create<LimiteDepenseStoreState>((set) => ({
  limites: [],
  loading: false,
  error: null,

  setLimites: (limites) => set({ limites }),

  fetchLimites: async () => {
    set({ loading: true, error: null });
    try {
      const limites = await LimiteDepenseRepository.recuperTous();
      set({ limites, loading: false });
    } catch (error) {
      console.error("Erreur lors du chargement des limites :", error);
      set({ error: "Impossible de charger les limites", loading: false });
    }
  },

  createLimite: async (limite) => {
    try {
      const id = await LimiteDepenseRepository.sauvegarderLimite(limite);
      set((state) => ({ limites: [...state.limites, { ...limite, id }] }));
      return id;
    } catch (error) {
      console.error("Erreur lors de la création de la limite :", error);
      throw error;
    }
  },

  updateLimite: async (limite) => {
    try {
      // LimiteDepenseRepository.mettreAJourLimite attend un objet Categorie dans l'implémentation existante.
      // On contourne en appelant directement la méthode prévue.
      await LimiteDepenseRepository.mettreAJourLimite({
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

  deleteParCategorie: async (idCategorie) => {
    try {
      await LimiteDepenseRepository.supprimerParCategorie(idCategorie);
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
