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

  recupererSommeMontantParCategorie: async(): Promise<any[]> =>{
    const requete = "SELECT c.libelle, SUM(d.montant) FROM depenses d JOIN categorie ON c.id = d.categorie_id GROUP BY c.id";
    const resultat = await db.getAllAsync<any>(requete);

    return resultat;
  },

  recupererSommeParMoisAnnee: async(mois: string, annee:string): Promise<any|null> =>{
    const requete = "SELECT SUM(montant) AS total FROM depenses WHERE date >= ? AND date <= ?";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<any>([`01-${mois}-${annee}` ,`31-${mois}-${annee}`])
    
    return await resultat.getFirstAsync();
  }
};
