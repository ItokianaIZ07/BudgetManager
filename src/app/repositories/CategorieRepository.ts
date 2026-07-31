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
    }
}