export interface Depense {
  id?: number;              // Identifiant unique local (géré par SQLite)
  montant: number;          // Montant de la dépense (ex: 15000)
  description: string;      // Description ou note sur la dépense
  date: string;             // Date au format AAAA-MM-JJ (ex: "2026-07-21")
  categorie_id: number;     // Identifiant de la catégorie rattachée
  mode_paiement: string;    // Mode de paiement (ex: "Espèce", "Carte")
  cree_le?: string;         // Date de création dans la base
  mis_a_jour_le?: string;   // Date de dernière modification
}