import Header from "@/components/header";
import HistoryCard from "@/components/history/HistoryCard";
import { AppTheme } from "@/constants/theme";
import { initializeApplication } from "@/database/databaseInit";
import { useCategorieStore } from "@/store/categorieStore";
import { useDepenseStore } from "@/store/depenseStore";
import { useLimiteDepenseStore } from "@/store/limiteDepenseStore";
import { useStatsStore } from "@/store/statsStore";
import { router } from "expo-router";
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
import { getCurrentDateParts, Util } from "../utils/util";

export default function PageAccueil() {
  const [estPret, setEstPret] = useState<boolean>(false);

  const { mois, annee } = getCurrentDateParts();

  const depenses = useDepenseStore((state) => state.depenses);
  const fetchDepenses = useDepenseStore((state) => state.fetchDepenses);
  const deleteDepense = useDepenseStore((state) => state.deleteDepense);
  const setDepensesStats = useStatsStore((state) => state.setDepenses);

  const total = useMemo(() => {
    return depenses.reduce((somme, item) => somme + item.montant, 0);
  }, [depenses]);

  const rechargeDepense = async (id: number) => {
    await deleteDepense(id);
    await initialiserDonneeDepense();
  };

  async function chargerDepenses() {
    await fetchDepenses();
    // Initialiser les autres stores pour éviter des requêtes répétées
    await useCategorieStore.getState().fetchCategories();
    await useLimiteDepenseStore.getState().fetchLimites();
  }

  async function supprimerDepense(id: number) {
    await rechargeDepense(id);
  }

  async function initialiserDonneeDepense() {
    await useStatsStore.getState().fetchDepenses(mois, annee);
  }

  useEffect(() => {
    const preparerApplication = async () => {
      try {
        await initializeApplication(async () => {
          await initialiserDonneeDepense();
        });
        await chargerDepenses();
      } finally {
        setEstPret(true);
      }
    };
    preparerApplication();
  }, []);

  if (!estPret) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        <Text style={styles.loadingText}>
          Initialisation de la base de données...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header />
      <FlatList
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
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
        )}
        data={depenses}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <HistoryCard item={item} onDelete={supprimerDepense} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyComponent}>
            <Text style={styles.label}>Aucune dépense enregistrée</Text>
            <Button
              title="Ajouter une dépense"
              onPress={() => router.push("/depense")}
            />
          </View>
        )}
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
    backgroundColor: AppTheme.colors.background,
  },
  loadingText: {
    color: AppTheme.colors.textMuted,
    marginTop: 8,
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
