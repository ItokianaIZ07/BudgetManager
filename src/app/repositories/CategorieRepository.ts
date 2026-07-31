import { db } from "@/database/sqlite"
import { Categorie } from "@/models/Categorie";

export const CategorieRepository = {
    recupererTous: ()=>{
        const requete = "SELECT * FROM categorie";
        const response = db.getAllSync<Categorie>(requete);

        return response;
    }
}