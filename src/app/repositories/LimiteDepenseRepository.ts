import { db } from "@/database/sqlite"
import { Categorie } from "@/models/Categorie";
import { LimiteDepense } from "@/models/LimiteDepense";

export const LimiteDepenseRepository = {
    recuperTous: async (): Promise<LimiteDepense[]>  =>{
        const requete = "SELECT * FROM limite_depense ORDER BY id ASC";
        const response = await db.getAllAsync<LimiteDepense>(requete);
        
        return response;
    },

    mettreAJourLimite: async (categorie: Categorie): Promise<void> => {
        const requete = "UPDATE limite_depense SET limite = ? WHERE categorie_id = ?";
        await db.runAsync(requete, [categorie.limite!, categorie.id!]);
    },

    sauvegarderLimite: async (limiteDepense: Omit<LimiteDepense, "id">): Promise<number> =>{
        const requete = "INSERT INTO limite_depense(categorie_id, limite) VALUES(?, ?)";
        const resultat = await db.runAsync(requete, [limiteDepense.idCategorie, limiteDepense.limite]);
        
        console.log("Limite inserer avec succès!");

        return resultat.lastInsertRowId;
    },
}