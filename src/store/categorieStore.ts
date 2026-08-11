import { Categorie } from "@/models/Categorie";
import { CategorieRepository } from "@/repositories/CategorieRepository";
import { DepenseRepository } from "@/repositories/DepenseRepository";
import { LimiteDepenseRepository } from "@/repositories/LimiteDepenseRepository";
import { useDepenseStore } from "@/store/depenseStore";
import { useLimiteDepenseStore } from "@/store/limiteDepenseStore";
import { create } from "zustand";

interface CategorieStoreState {
  categories: Categorie[];
  loading: boolean;
  error: string | null;
  setCategories: (categories: Categorie[]) => void;
  fetchCategories: () => Promise<void>;
  createCategorie: (categorie: Omit<Categorie, "id">) => Promise<number>;
  updateCategorie: (categorie: Categorie) => Promise<void>;
  deleteCategorie: (id: number) => Promise<void>;
}

export const useCategorieStore = create<CategorieStoreState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  setCategories: (categories) => set({ categories }),

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await CategorieRepository.recupererTous();
      set({ categories, loading: false });
    } catch (error) {
      console.error("Erreur lors du chargement des catégories :", error);
      set({ error: "Impossible de charger les catégories", loading: false });
    }
  },

  createCategorie: async (categorie) => {
    try {
      const id = await CategorieRepository.sauvegarderCategorie(categorie);
      set((state) => ({
        categories: [...state.categories, { ...categorie, id }],
      }));
      return id;
    } catch (error) {
      console.error("Erreur lors de la création de la catégorie :", error);
      throw error;
    }
  },

  updateCategorie: async (categorie) => {
    if (!categorie.id) throw new Error("ID manquant pour la mise à jour");
    try {
      await CategorieRepository.mettreAJourCategorie(categorie);
      set((state) => ({
        categories: state.categories.map((c) =>
          c.id === categorie.id ? categorie : c,
        ),
      }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la catégorie :", error);
      throw error;
    }
  },

  deleteCategorie: async (id) => {
    try {
      await DepenseRepository.supprimerParCategorie(id);
      await LimiteDepenseRepository.supprimerParCategorie(id);
      await CategorieRepository.supprimerCategorie(id);

      const depenseStore = useDepenseStore.getState();
      depenseStore.setDepenses(
        depenseStore.depenses.filter((d) => d.categorie_id !== id),
      );

      const limiteStore = useLimiteDepenseStore.getState();
      limiteStore.setLimites(
        limiteStore.limites.filter((l) => l.idCategorie !== id),
      );

      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie :", error);
      throw error;
    }
  },
}));

export default useCategorieStore;
