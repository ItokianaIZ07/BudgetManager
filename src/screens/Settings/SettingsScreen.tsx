import { AppTheme } from "@/constants/theme";
import { initDatabase, initializeData, resetDatabase } from "@/database/sqlite";
import { useCategorieStore } from "@/store/categorieStore";
import { useDepenseStore } from "@/store/depenseStore";
import { useLimiteDepenseStore } from "@/store/limiteDepenseStore";
import { useStatsStore } from "@/store/statsStore";
import { getCurrentDateParts } from "@/utils/util";
import { router } from "expo-router";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsScreen() {
  const anneeActuelle = new Date().getFullYear();
  const deleteAllStore = useStatsStore((state) => state.deleteAll);
  const clearData = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir supprimer cette dépense ?\nLes dépenses supprimer ne pourrant plus être récuperé !",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await useDepenseStore.getState().deleteAll();
            deleteAllStore();
            router.push("/");
          },
        },
      ],
    );
  };

  const reconfigApp = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir restaurer les configurations de base ?\nToutes vos modifications seront perdus !",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            deleteAllStore();

            await resetDatabase();
            await initDatabase();
            await initializeData();

            await useCategorieStore.getState().fetchCategories();
            await useLimiteDepenseStore.getState().fetchLimites();
            await useDepenseStore.getState().fetchDepenses();
            const { mois, annee } = getCurrentDateParts();
            await useStatsStore.getState().fetchDepenses(mois, annee);

            router.push("/");
          },
        },
      ],
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* <Header /> */}
      <View style={styles.cardContainer}>
        <Text style={styles.label}>Préferences</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/settings/category")}
          >
            <View style={styles.action}>
              <Text style={styles.buttonLabel}>Catégories</Text>
              <Image
                source={require("@/assets/images/category.png")}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/settings/about" as never)}
          >
            <View style={styles.action}>
              <Text style={styles.buttonLabel}>À propos</Text>
              <Image
                source={require("@/assets/images/alert-circle.png")}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <Text style={styles.label}>Données & Sécurité</Text>
        <View style={styles.card}>
          <TouchableOpacity onPress={clearData} style={styles.button}>
            <View style={styles.action}>
              <Text style={styles.buttonLabel}>
                Supprimer toutes les dépenses
              </Text>
              <Image
                source={require("@/assets/images/trash.png")}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={reconfigApp} style={styles.button}>
            <View style={styles.action}>
              <Text style={styles.buttonLabel}>
                Restaurer les configurations par défaut
              </Text>
              <Image
                source={require("@/assets/images/refresh.png")}
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>
          &copy; {anneeActuelle} - Budget Manager by ItokianaIZ07. Compte bien,
          dépense peu.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  cardContainer: {
    margin: 16,
    flexDirection: "column",
    gap: 8,
  },
  card: {
    flexDirection: "column",
  },
  action: {
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  button: {
    height: 56,
    justifyContent: "center",
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.md,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    paddingVertical: 8,
    marginVertical: 4,
  },
  label: {
    color: AppTheme.colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  buttonLabel: {
    fontSize: 14,
    color: AppTheme.colors.text,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    alignItems: "center",
    padding: 8,
    width: "100%",
  },
  footerLabel: {
    fontSize: 9,
    textAlign: "center",
    fontStyle: "italic",
    color: AppTheme.colors.textMuted,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
