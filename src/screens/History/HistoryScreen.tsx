import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import Header from "@/components/header";
import HistoryCard from "@/components/history/HistoryCard";
import SortComponent from "@/components/history/SortComponent";
import { AppTheme } from "@/constants/theme";
import { Depense } from "@/models/Depense";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Button,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function HistoryScreen() {
  const [depenses, setDepenses] = useState<Depense[]>([]);

  const rechargeDepense = (id: number) => {
    setDepenses((depenses) => depenses.filter((item) => item.id !== id));
  };

  async function chargerDepenses() {
    const donnees = await DepenseRepository.recupererToutes();
    setDepenses(donnees);
  }

  async function supprimerDepense(id: number) {
    await DepenseRepository.supprimerDepense(id);
    rechargeDepense(id);
  }

  const sortById = async (id: number) => {
    if (id <= 0) {
      await chargerDepenses();
      return;
    }
    const donnees = await DepenseRepository.recupererParCategorie(id);
    setDepenses(donnees);
  };

  const searchByKeyWord = async (keyword: string) => {
    if (keyword.trim() === "") {
      await chargerDepenses();
      return;
    }
    const donnees = await DepenseRepository.rechercherParMotCle(keyword);
    // const donnees = depenses.filter((d)=>d.description.toLowerCase().startsWith(keyword.toLowerCase()))
    setDepenses(donnees);
  };

  useFocusEffect(useCallback(() => {
    sortById(-1);
  }, []));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header />
      {/* <HistoryHeader depenses={depenses} /> */}
      <SortComponent onSort={sortById} onInput={searchByKeyWord} />
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.headerApp}>
            <Text style={styles.headerTitle}>
              Historique ({depenses.length})
            </Text>
          </View>
        )}
        data={depenses}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <HistoryCard item={item} onDelete={supprimerDepense} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyComponent}>
            <Text style={styles.label}>
              Aucune dépense enregistrée pour cette catégorie
            </Text>
            <Button
              title="Ajouter une dépense"
              onPress={() => router.push("/depense")}
            />
          </View>
        )}
      ></FlatList>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
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
  headerApp: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: AppTheme.radius.md,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppTheme.colors.primary,
  },
});
