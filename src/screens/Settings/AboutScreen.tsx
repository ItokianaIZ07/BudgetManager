import { AppTheme } from "@/constants/theme";
import { router } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AboutScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerCard}>
          <Text style={styles.appName}>Budget Manager</Text>
          <Text style={styles.version}>Version v1</Text>
          <Text style={styles.description}>
            Une application simple et pratique pour suivre vos dépenses, gérer
            vos catégories et garder un meilleur contrôle de votre budget au
            quotidien.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Développeur</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>GitHub</Text>
            <Text style={styles.value}>ItokianaIZ07</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nom</Text>
            <Text style={styles.value}>RABARIVELONJATOVO ZELIARILALA</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Prénom</Text>
            <Text style={styles.value}>Itokiana</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>À propos de l&apos;application</Text>
          <Text style={styles.description}>
            Budget Manager a été conçu pour aider à enregistrer rapidement les
            dépenses, visualiser les tendances mensuelles et mieux organiser ses
            finances personnelles.
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 20,
    marginBottom: 16,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: AppTheme.colors.primary,
    marginBottom: 6,
  },
  version: {
    fontSize: 14,
    fontWeight: "600",
    color: AppTheme.colors.secondary,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: AppTheme.colors.textMuted,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 18,
    marginBottom: 16,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: AppTheme.colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AppTheme.colors.border,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: AppTheme.colors.textMuted,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: AppTheme.colors.text,
    flex: 1,
    textAlign: "right",
    marginLeft: 8,
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.radius.md,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
