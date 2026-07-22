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
};
