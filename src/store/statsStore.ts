import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import { create } from "zustand";

interface StatsStore {
  depenses: any[];

  setDepenses: (depenses: any[]) => void;
  addDepense: (depense: any) => void;
  updateDepense: (depense: any) => void;
  deleteDepense: (id: number) => void;
  deleteAll: () => void;
  fetchDepenses: (mois: string, annee: string) => Promise<void>;
  fetchTotalForMonth: (mois: string, annee: string) => Promise<number>;
  getDepensesParCategorie: (mois: string, annee: string) => Promise<any[]>;
}

export const useStatsStore = create<StatsStore>((set) => ({
  depenses: [],
  setDepenses: (depenses) => set({ depenses }),

  addDepense: (depense) =>
    set((state) => ({
      depenses: [...state.depenses, depense],
    })),

  updateDepense: (depense) =>
    set((state) => ({
      depenses: state.depenses.map((e) => (e.id === depense.id ? depense : e)),
    })),

  deleteDepense: (id) =>
    set((state) => ({
      depenses: state.depenses.filter((e) => e.id !== id),
    })),

  deleteAll: () => {
    set(() => ({
      depenses: [],
    }));
  },
  fetchDepenses: async (mois: string, annee: string) => {
    try {
      const data = await DepenseRepository.recupererSommeMontantParCategorie(
        mois,
        annee,
      );
      set({ depenses: data || [] });
    } catch (error) {
      console.error("Erreur lors de la récupération des agrégats :", error);
    }
  },
  fetchTotalForMonth: async (mois: string, annee: string) => {
    try {
      const resultat = await DepenseRepository.recupererSommeParMoisAnnee(
        mois,
        annee,
      );
      return resultat !== null ? resultat.total : 0;
    } catch (error) {
      console.error("Erreur lors de la récupération du total mensuel :", error);
      return 0;
    }
  },
  getDepensesParCategorie: async (mois: string, annee: string) => {
    try {
      const data =
        await DepenseRepository.recupererDepensesParCategorieMoisAnnee(
          mois,
          annee,
        );
      return data || [];
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des dépenses par catégorie :",
        error,
      );
      return [];
    }
  },
}));
