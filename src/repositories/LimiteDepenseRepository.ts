import { Categorie } from "@/models/Categorie";
import { LimiteDepense } from "@/models/LimiteDepense";
import type { SQLiteDatabase } from "expo-sqlite";

export const LimiteDepenseRepository = {
  recuperTous: async (db: SQLiteDatabase): Promise<LimiteDepense[]> => {
    const requete = "SELECT * FROM limite_depense ORDER BY id ASC";
    const response = await db.getAllAsync<LimiteDepense>(requete);

    return response;
  },

  mettreAJourLimite: async (
    db: SQLiteDatabase,
    categorie: Categorie,
  ): Promise<void> => {
    const requete =
      "UPDATE limite_depense SET limite = ? WHERE categorie_id = ?";
    await db.runAsync(requete, [categorie.limite!, categorie.id!]);
  },

  sauvegarderLimite: async (
    db: SQLiteDatabase,
    limiteDepense: Omit<LimiteDepense, "id">,
  ): Promise<number> => {
    const requete =
      "INSERT INTO limite_depense(categorie_id, limite) VALUES(?, ?)";
    const resultat = await db.runAsync(requete, [
      limiteDepense.idCategorie,
      limiteDepense.limite,
    ]);

    console.log("Limite inserer avec succès!");

    return resultat.lastInsertRowId;
  },

  supprimerParCategorie: async (
    db: SQLiteDatabase,
    id: number,
  ): Promise<void> => {
    const requete = "DELETE FROM limite_depense WHERE categorie_id = ?";
    await db.runAsync(requete, [id]);
  },
};
