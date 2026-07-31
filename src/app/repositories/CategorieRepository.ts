import { db } from "@/database/sqlite"
import { Categorie } from "@/models/Categorie";

export const CategorieRepository = {
    recupererTous: ()=>{
        const requete = "SELECT * FROM categorie";
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
        const requete = "UPDATE TABLE categorie SET libelle = ? WHERE id = ?";
        await db.runAsync(requete, [categorie.libelle, categorie.id!]);
    }
}