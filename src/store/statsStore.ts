import { Depense } from "@/models/Depense";
import {create } from "zustand";

interface StatsStore {
    depenses: any[];

    setDepenses: (depenses: any[]) =>void;
    addDepense: (depense: any)=>void;
    updateDepense: (depense: any)=>void;
    deleteDepense:(id:number)=>void
}    

export const useStatsStore = create<StatsStore>((set)=>({
    depenses: [],
    setDepenses: (depenses)=>
        set({depenses}),
    
    addDepense: (depense)=>
        set((state)=>({
            depenses: [...state.depenses, depense]
        })),
    
    updateDepense: (depense)=>
        set((state)=>({
            depenses: state.depenses.map((e)=>e.id === depense.id ? depense: e)
        })),
    
    deleteDepense: (id)=>
        set((state)=>({
            depenses: state.depenses.filter((e)=>e.id!==id)
        }))
}));