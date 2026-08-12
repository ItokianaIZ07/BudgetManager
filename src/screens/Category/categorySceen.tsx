// repositories replaced by stores
import FormModal from "@/components/category/FormModal";
import { AppTheme } from "@/constants/theme";
import { Categorie } from "@/models/Categorie";
import { useCategorieStore } from "@/store/categorieStore";
import { useLimiteDepenseStore } from "@/store/limiteDepenseStore";
import { useStatsStore } from "@/store/statsStore";
import { getCurrentDateParts } from "@/utils/util";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CategoryScreen() {
  const db = useSQLiteContext();
  const categories = useCategorieStore((state) => state.categories);
  const [visible, setVisible] = useState<boolean>(false);
  const [categorieEdited, setCategorieEdited] = useState<Categorie>();
  const [mode, setMode] = useState<string>("add");

  const loadCategories = () => {
    useCategorieStore.getState().fetchCategories(db);
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir supprimer cette catégorie ? Les dépenses et limites associées seront également supprimées.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await useCategorieStore.getState().deleteCategorie(db, id);
              useStatsStore.getState().deleteDepense(id);
              await useLimiteDepenseStore.getState().fetchLimites(db);
              await useCategorieStore.getState().fetchCategories(db);
              const { mois, annee } = getCurrentDateParts();
              await useStatsStore.getState().fetchDepenses(db, mois, annee);
            } catch (error) {
              console.error(
                "Erreur lors de la suppression de la catégorie :",
                error,
              );
            }
          },
        },
      ],
    );
  };

  const showEditModal = (categorie: Categorie) => {
    setCategorieEdited(categorie);
    setMode("edit");
    setVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={styles.addContainer}
      >
        <Image
          source={require("@/assets/images/tabIcons/square-plus.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
      <FormModal
        onRefresh={loadCategories}
        visible={visible}
        setVisible={setVisible}
        mode={mode}
        setMode={setMode}
        categorie={categorieEdited}
        setCategorie={setCategorieEdited}
      />
      <FlatList
        style={styles.catContainer}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.label}>
              Liste des catégories ({categories.length})
            </Text>
          </View>
        )}
        data={categories}
        keyExtractor={(item) => item.libelle}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <Text style={styles.categoryLabel}>{item.libelle}</Text>
            <View style={styles.action}>
              <TouchableOpacity
                onPress={() => handleDelete(item.id!)}
                style={[styles.actionContent, styles.actionDelete]}
              >
                <Image
                  source={require("@/assets/images/trash.png")}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => showEditModal(item)}
                style={[styles.actionContent, styles.actionEdit]}
              >
                <Image
                  source={require("@/assets/images/pencil.png")}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View>
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
  addContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 8,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderRadius: AppTheme.radius.md,
    margin: 8,
  },
  catContainer: {
    margin: 8,
    flexDirection: "column",
    borderRadius: AppTheme.radius.md,
    gap: 8,
  },
  categoryCard: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: AppTheme.colors.surface,
    marginVertical: 4,
    borderRadius: AppTheme.radius.md,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    height: 56,
    alignItems: "center",
  },
  categoryLabel: {
    fontSize: 18,
    color: AppTheme.colors.text,
  },
  label: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  icon: {
    width: 40,
    height: 40,
  },
  action: {
    flexDirection: "row",
    gap: 4,
    width: 64,
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
  },
  actionContent: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionDelete: {
    backgroundColor: AppTheme.colors.dangerSoft,
  },
  actionEdit: {
    backgroundColor: AppTheme.colors.primarySoft,
  },
  actionIcon: {
    width: 20,
    height: 20,
  },
});
