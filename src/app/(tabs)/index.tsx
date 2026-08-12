import Header from "@/components/header";
import HistoryCard from "@/components/history/HistoryCard";
import { AppTheme } from "@/constants/theme";
import { initializeApplication } from "@/database/databaseInit";
import { useCategorieStore } from "@/store/categorieStore";
import { useDepenseStore } from "@/store/depenseStore";
import { useLimiteDepenseStore } from "@/store/limiteDepenseStore";
import { useStatsStore } from "@/store/statsStore";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getCurrentDateParts, Util } from "../../utils/util";

export default function PageAccueil() {
  console.log(".PageAccueil render");
  const db = useSQLiteContext();

  const [estPret, setEstPret] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const { mois, annee } = getCurrentDateParts();

  const depenses = useDepenseStore((state) => state.depenses);
  const fetchDepenses = useDepenseStore((state) => state.fetchDepenses);
  const deleteDepense = useDepenseStore((state) => state.deleteDepense);

  const total = useMemo(() => {
    return depenses.reduce((somme, item) => somme + item.montant, 0);
  }, [depenses]);

  async function initialiserDonneeDepense() {
    await useStatsStore.getState().fetchDepenses(db, mois, annee);
  }

  async function chargerDepenses() {
    await fetchDepenses(db);
    await useCategorieStore.getState().fetchCategories(db);
    await useLimiteDepenseStore.getState().fetchLimites(db);
  }

  async function supprimerDepense(id: number) {
    try {
      await deleteDepense(db, id);
      await initialiserDonneeDepense();
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense :", error);
    }
  }

  useEffect(() => {
    let estAnnule = false;

    const preparerApplication = async () => {
      try {
        console.log("Préparation de l'application...");
        setErreur(null);
        setEstPret(false);

        // Initialisation éventuelle des modules globaux
        await initializeApplication(db, async () => {
          await initialiserDonneeDepense();
        });

        // Chargement séquentiel des données dans les stores Zustand
        console.log("Chargement des dépenses et métadonnées...");
        await chargerDepenses();
        console.log("Dépenses chargées avec succès.");

        if (!estAnnule) {
          setEstPret(true);
          console.log("Application initialisée et prête !");
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation :", error);

        if (!estAnnule) {
          setErreur(
            "Une erreur est survenue lors du démarrage de l'application.",
          );
        }
      }
    };

    preparerApplication();

    return () => {
      estAnnule = true;
    };
  }, [db]);

  if (erreur) {
    return (
      <View style={styles.centre}>
        <Text style={styles.errorTitle}>
          Impossible de démarrer l'application
        </Text>
        <Text style={styles.errorText}>{erreur}</Text>
        <Button
          title="Réessayer"
          onPress={() => {
            setErreur(null);
            setEstPret(false);
            router.replace("/" as any);
          }}
        />
      </View>
    );
  }

  if (!estPret) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        <Text style={styles.loadingText}>
          Initialisation de l'application...
        </Text>
      </View>
    );
  }

  console.log(".Rendu principal de PageAccueil");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header />

      <FlatList
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.cardStat}>
              <Text style={styles.title}>Total du mois</Text>
              <Text style={styles.valeur}>{Util.formatNumber(total)} Ar</Text>
            </View>

            <View style={styles.cardStatSecondary}>
              <Text style={styles.title}>Transactions</Text>
              <Text style={styles.valeur}>{depenses.length}</Text>
            </View>
          </View>
        }
        data={depenses}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <HistoryCard item={item} onDelete={supprimerDepense} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyComponent}>
            <Text style={styles.label}>Aucune dépense enregistrée</Text>
            <Button
              title="Ajouter une dépense"
              onPress={() => router.push("/depense")}
            />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  listContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: "700",
    color: AppTheme.colors.textMuted,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valeur: {
    fontSize: 20,
    color: AppTheme.colors.primary,
    fontWeight: "bold",
  },
  centre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: AppTheme.colors.background,
  },
  loadingText: {
    color: AppTheme.colors.textMuted,
    marginTop: 12,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppTheme.colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  emptyComponent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: AppTheme.colors.background,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: AppTheme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  cardStat: {
    flex: 1,
    backgroundColor: AppTheme.colors.surface,
    padding: 12,
    borderRadius: AppTheme.radius.md,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardStatSecondary: {
    flex: 1,
    backgroundColor: AppTheme.colors.primarySoft,
    padding: 12,
    borderRadius: AppTheme.radius.md,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
});
