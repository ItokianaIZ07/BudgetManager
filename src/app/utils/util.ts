import { CategorieRepository } from "../repositories/CategorieRepository";

export const months = [
  { valeur: "01", label: "Jan" },
  { valeur: "02", label: "Fév" },
  { valeur: "03", label: "Mars" },
  { valeur: "04", label: "Avr" },
  { valeur: "05", label: "Mai" },
  { valeur: "06", label: "Juin" },
  { valeur: "07", label: "Juil" },
  { valeur: "08", label: "Août" },
  { valeur: "09", label: "Sept" },
  { valeur: "10", label: "Oct" },
  { valeur: "11", label: "Nov" },
  { valeur: "12", label: "Déc" },
];

export const getMonth = (mois: string) => {
  return months.find((m) => m.valeur == mois)!.label;
};

export const Util = {
  formatNumber: (prix: number) => {
    if(prix == null){
      return 0
    }
    return prix.toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  },

  formatDate: (date: string) => {
    const [y, m, d] = date.split("-");
    return d + " " + getMonth(m) + " " + y;
  },
};
