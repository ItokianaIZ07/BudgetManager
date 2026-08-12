import { Categorie } from "@/models/Categorie";
import type { SQLiteDatabase } from "expo-sqlite";

export const CategorieRepository = {
  recupererTous: async (db: SQLiteDatabase) => {
    const requete =
      "SELECT c.id, c.libelle, l.limite FROM categorie c JOIN limite_depense l ON l.categorie_id = c.id ORDER BY c.id ASC";
    const response = await db.getAllAsync<Categorie>(requete);

    return response;
  },

  supprimerCategorie: async (db: SQLiteDatabase, id: number) => {
    const requete = "DELETE FROM categorie WHERE id=?";
    await db.runAsync(requete, [id]);
  },

  sauvegarderCategorie: async (
    db: SQLiteDatabase,
    categorie: Omit<Categorie, "id">,
  ) => {
    const requete = "INSERT INTO categorie(libelle) VALUES(?)";
    const resultat = await db.runAsync(requete, [categorie.libelle]);

    return resultat.lastInsertRowId;
  },

  mettreAJourCategorie: async (db: SQLiteDatabase, categorie: Categorie) => {
    const requete = "UPDATE categorie SET libelle = ? WHERE id = ?";
    await db.runAsync(requete, [categorie.libelle, categorie.id!]);
  },

  recupererParId: async (
    db: SQLiteDatabase,
    id: number,
  ): Promise<Categorie | null> => {
    const requete = "SELECT * FROM categorie WHERE id = ?";
    const response = await db.getFirstAsync<Categorie>(requete, [id]);

    return response;
  },
};
