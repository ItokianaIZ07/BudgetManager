import { Depense } from "@/models/Depense";
import type { SQLiteDatabase } from "expo-sqlite";

export const DepenseRepository = {
  ajouter: async (
    db: SQLiteDatabase,
    depense: Omit<Depense, "id">,
  ): Promise<number> => {
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

  recupererToutes: async (db: SQLiteDatabase): Promise<Depense[]> => {
    const requete = "SELECT * FROM depenses ORDER BY date DESC";
    const resultat = await db.getAllAsync<Depense>(requete);

    return resultat;
  },

  supprimerDepense: async (db: SQLiteDatabase, id: number): Promise<void> => {
    const requete = "DELETE FROM depenses WHERE id = ?";
    await db.runAsync(requete, [id]);
  },

  mettreAJour: async (db: SQLiteDatabase, depense: Depense): Promise<void> => {
    if (!depense.id) {
      throw new Error(
        "Impossible de mettre à jour une dépense sans identifiant",
      );
    }

    const requete = `
      UPDATE depenses
      SET montant = ?, description = ?, date = ?, categorie_id = ?, mode_paiement = ?, mis_a_jour_le = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.runAsync(requete, [
      depense.montant,
      depense.description,
      depense.date,
      depense.categorie_id,
      depense.mode_paiement,
      depense.id,
    ]);
  },

  recupererParCategorie: async (
    db: SQLiteDatabase,
    id: number,
  ): Promise<Depense[]> => {
    const requete =
      "SELECT * FROM depenses WHERE categorie_id = ? ORDER BY date DESC";
    const resultat = await db.getAllAsync<Depense>(requete, [id]);

    return resultat;
  },

  rechercherParMotCle: async (
    db: SQLiteDatabase,
    keyword: string,
  ): Promise<Depense[]> => {
    const requete = "SELECT * FROM depenses WHERE description LIKE ?";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<Depense>([`${keyword}%`]);
    try {
      return await resultat.getAllAsync();
    } finally {
      if (stmt) {
        if (typeof (stmt as any).finalizeAsync === "function") {
          await (stmt as any).finalizeAsync();
        } else if (typeof (stmt as any).finalize === "function") {
          (stmt as any).finalize();
        }
      }
    }
  },

  supprimerTout: async (db: SQLiteDatabase): Promise<void> => {
    const requete = "DELETE FROM depenses";
    await db.runAsync(requete);
  },

  recupererSommeMontantParCategorie: async (
    db: SQLiteDatabase,
    mois: string,
    annee: string,
  ) => {
    const requete =
      "SELECT c.id, c.libelle as categorie, SUM(d.montant) as total, l.limite FROM depenses d JOIN categorie c ON c.id = d.categorie_id LEFT JOIN limite_depense l ON c.id = l.categorie_id WHERE d.date >= ? AND d.date <= date GROUP BY c.id ORDER BY total ASC";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<any>([
      `01-${mois}-${annee}`,
      `31-${mois}-${annee}`,
    ]);
    try {
      return await resultat.getAllAsync();
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la recupération des dépenses par catégorie",
        error,
      );
    } finally {
      if (stmt) {
        if (typeof (stmt as any).finalizeAsync === "function") {
          await (stmt as any).finalizeAsync();
        } else if (typeof (stmt as any).finalize === "function") {
          (stmt as any).finalize();
        }
      }
    }
  },

  recupererSommeParMoisAnnee: async (
    db: SQLiteDatabase,
    mois: string,
    annee: string,
  ): Promise<any | null> => {
    const requete =
      "SELECT SUM(montant) AS total FROM depenses WHERE date >= ? AND date <= ?";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<any>([
      `01-${mois}-${annee}`,
      `31-${mois}-${annee}`,
    ]);
    try {
      return await resultat.getFirstAsync();
    } catch (error) {
      console.error(error);
    } finally {
      if (stmt) {
        if (typeof (stmt as any).finalizeAsync === "function") {
          await (stmt as any).finalizeAsync();
        } else if (typeof (stmt as any).finalize === "function") {
          (stmt as any).finalize();
        }
      }
    }
  },

  recupererDepensesParCategorieMoisAnnee: async (
    db: SQLiteDatabase,
    mois: string,
    annee: string,
  ): Promise<any[]> => {
    const requete =
      "SELECT c.id, c.libelle as categorie, SUM(d.montant) as total, l.limite FROM depenses d JOIN categorie c ON c.id = d.categorie_id LEFT JOIN limite_depense l ON c.id = l.categorie_id WHERE substr(d.date, 1, 4) = ? AND substr(d.date, 6, 2) = ? GROUP BY c.id ORDER BY total ASC";
    const stmt = await db.prepareAsync(requete);
    const resultat = await stmt.executeAsync<any>([annee, mois]);
    try {
      return await resultat.getAllAsync();
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la récupération des dépenses par catégorie pour le mois",
        error,
      );
      return [];
    } finally {
      if (stmt) {
        if (typeof (stmt as any).finalizeAsync === "function") {
          await (stmt as any).finalizeAsync();
        } else if (typeof (stmt as any).finalize === "function") {
          (stmt as any).finalize();
        }
      }
    }
  },

  supprimerParCategorie: async (
    db: SQLiteDatabase,
    id: number,
  ): Promise<void> => {
    const requete = "DELETE FROM depenses WHERE categorie_id = ?";
    await db.runAsync(requete, [id]);
  },
};
