import { db } from "@/database/sqlite"
import { Categorie } from "@/models/Categorie";
import { LimiteDepenseRepository } from "./LimiteDepenseRepository";

export const CategorieRepository = {
    recupererTous: ()=>{
        const requete = "SELECT c.id, c.libelle, l.limite FROM categorie c JOIN limite_depense l ON l.categorie_id = c.id ORDER BY c.id ASC";
        const response = db.getAllSync<Categorie>(requete);

        return response;
    },

    supprimerCategorie: async (id: number)=>{
        const requete = "DELETE FROM categorie WHERE id=?";
        await db.runAsync(requete, [id]);
    },

    sauvegarderCategorie: async (categorie: Omit<Categorie, "id">)=>{
        const requete = "INSERT INTO categorie(libelle) VALUES(?)";
        const resultat = await db.runAsync(requete, [categorie.libelle]);
        
        return resultat.lastInsertRowId;
    },

    mettreAJourCategorie: async (categorie: Categorie)=>{
        const requete = "UPDATE categorie SET libelle = ? WHERE id = ?";
        await db.runAsync(requete, [categorie.libelle, categorie.id!]);
    },

    recupererParId: async (id: number) : Promise<Categorie|null> =>{
        const requete = "SELECT * FROM categorie WHERE id = ?";
        const response = await db.getFirstAsync<Categorie>(requete, [id]);

        return response;
    }
}