import { db } from "@/database/sqlite"
import { Categorie } from "@/models/Categorie";
import { LimiteDepense } from "@/models/LimiteDepense";

export const LimiteDepenseRepository = {
    recuperTous: async (): Promise<LimiteDepense[]>  =>{
        const requete = "SELECT * FROM limite_depense ORDER BY id ASC";
        const response = await db.getAllAsync<LimiteDepense>(requete);
        
        return response;
    },

    mettreAJourLimite: async (categorie: Categorie, newLimit: number): Promise<void> => {
        const requete = "UPDATE limite_depense SET limite = ? WHERE categorie_id = ?";
        await db.runAsync(requete, [categorie.id!, newLimit]);
    }
}