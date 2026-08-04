import Header from "@/components/header";
import HistoryCard from "@/components/history/HistoryCard";
import { AppTheme } from "@/constants/theme";
import { initDatabase, initializeData, isInitalized } from "@/database/sqlite";
import { Depense } from "@/models/Depense";
import { useStatsStore } from "@/store/statsStore";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { DepenseRepository } from "./repositories/DepenseRepository";
import { getCurrentDateParts, Util } from "./utils/util";

export default function PageAccueil() {
  const [estPret, setEstPret] = useState<boolean>(false);
  const [depenses, setDepenses] = useState<Depense[]>([]);

  const { mois, annee } = getCurrentDateParts();

  const setDepensesStats = useStatsStore((state) => state.setDepenses);

  const total = useMemo(() => {
    return depenses.reduce((somme, item) => somme + item.montant, 0);
  }, [depenses]);

  const rechargeDepense = async (id: number) => {
    setDepenses((depenses) => depenses.filter((item) => item.id !== id));
    await initialiserDonneeDepense();
  };

  async function chargerDepenses() {
    const donnees = await DepenseRepository.recupererToutes();
    setDepenses(donnees);
  }

  async function supprimerDepense(id: number) {
    await DepenseRepository.supprimerDepense(id);
    rechargeDepense(id);
  }

  async function initialiserDonneeDepense() {
    const data = await DepenseRepository.recupererSommeMontantParCategorie(
      mois,
      annee,
    );
    setDepensesStats(data !== undefined ? data : []);
  }

  useEffect(() => {
    const preparerApplication = async () => {
      try {
        await initDatabase();
        if (isInitalized() == "false") {
          await initializeData();
        }
        await initialiserDonneeDepense();
      } catch (erreur) {
        console.error("Erreur au chargement :", erreur);
      } finally {
        setEstPret(true);
      }
    };
    preparerApplication();
  }, []);

  useFocusEffect(
    useCallback(() => {
      chargerDepenses();
    }, []),
  );

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
