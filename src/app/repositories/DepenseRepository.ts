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
};
