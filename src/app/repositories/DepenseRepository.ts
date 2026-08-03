import { db } from "@/database/sqlite";
import { Depense } from "@/models/Depense";
export const DepenseRepository = {
  ajouter: async (depense: Omit<Depense, "id">): Promise<number> => {
    const requete =
      "INSERT INTO depenses (montant, description, date, categorie_id, mode_paiement) VALUES (?, ?, ?, ?, ?)";
    const resultat = await db.runAsync(requete, [
      depense.montant,
      depense.description,
      depense.date,
      depense.categorie_id,
      depense.mode_paiement,
    ]);
    return resultat.lastInsertRowId;
  },

  recupererToutes: async () : Promise<Depense[]> =>{
    const requete = "SELECT * FROM depenses ORDER BY date DESC";
    const resultat = await db.getAllAsync<Depense>(requete);

    return resultat;
  },

  supprimerDepense: async (id: number) : Promise<void> => {
    const requete = "DELETE FROM depenses WHERE id = ?";
    await db.runAsync(requete, [id]);
  },

  recupererParCategorie: async(id: number) : Promise<Depense[]> =>{
    const requete = "SELECT * FROM depenses WHERE categorie_id = ? ORDER BY date DESC";
    const resultat = await db.getAllAsync<Depense>(requete, [id])

    return resultat;
  },

  rechercherParMotCle : async(keyword: string): Promise<Depense[]> =>{
    const requete = "SELECT * FROM depenses WHERE description LIKE ?";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<Depense>([`${keyword}%`])
    try{
      return await resultat.getAllAsync();
    }
    finally{
      stmt.finalizeAsync();
    }
  },

  supprimerTout : async(): Promise<void> =>{
    const requete = "DELETE FROM depenses";
    await db.runAsync(requete);
  },

  recupererSommeMontantParCategorie: async(mois: string, annee: string) =>{
    const requete = "SELECT c.id, c.libelle as categorie, SUM(d.montant) as total, l.limite FROM depenses d JOIN categorie c ON c.id = d.categorie_id LEFT JOIN limite_depense l ON c.id = l.categorie_id WHERE d.date >= ? AND d.date <= date GROUP BY c.id ORDER BY total ASC";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<any>([`01-${mois}-${annee}` ,`31-${mois}-${annee}`]);
    try{
      return await resultat.getAllAsync();
    }catch(error){
      console.error("Une erreur est survenue lors de la recupération des dépenses par catégorie", error);
    }finally{
      await stmt.finalizeAsync();
    }
  },

  recupererSommeParMoisAnnee: async(mois: string, annee:string): Promise<any|null> =>{
    const requete = "SELECT SUM(montant) AS total FROM depenses WHERE date >= ? AND date <= ?";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<any>([`01-${mois}-${annee}` ,`31-${mois}-${annee}`])
    try{
      return await resultat.getFirstAsync();
    }catch(error){
      console.error(error);
    }finally{
      await stmt.finalizeAsync();
    }
  }
};
