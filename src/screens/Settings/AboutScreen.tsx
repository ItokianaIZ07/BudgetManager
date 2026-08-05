import { AppTheme } from "@/constants/theme";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

export default function AboutScreen() {
  const handleLinkPress = async ()=>{
    Linking.openURL("https://github.com/ItokianaIZ07");
  }
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
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../../assets/images/dev.jpg")}
              style={styles.developerImage}
              resizeMode="cover"
            />
          </View>
          <Text style={styles.studentInfo}>
            Étudiant en informatique, je conçois des applications mobiles et
            web avec passion.
          </Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>GitHub</Text>
            <Text style={[styles.value, styles.linkStyle]} onPress={handleLinkPress}>ItokianaIZ07</Text>
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
  imageWrapper: {
    alignSelf: "center",
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 2,
    borderColor: AppTheme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppTheme.colors.background,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  developerImage: {
    width: "100%",
    height: "100%",
  },
  studentInfo: {
    fontSize: 14,
    lineHeight: 20,
    color: AppTheme.colors.textMuted,
    textAlign: "center",
    marginBottom: 16,
  },
  linkStyle: {
    color: AppTheme.colors.primary,
    textDecorationLine: "underline",
  }
});
