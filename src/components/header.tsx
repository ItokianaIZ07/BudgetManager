import { AppTheme } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Header() {
  return (
    <View style={styles.headerApp}>
      <View style={styles.headerTextBlock}>
        <Text style={styles.headerTitle}>Suivi de Budget</Text>
        <Text style={styles.headerSubtitle}>Gère tes dépenses en douceur</Text>
      </View>
      <View style={styles.logoWrapper}>
        <Image
          source={require("@/assets/images/tabIcons/currency-manat.png")}
          style={styles.logo}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerApp: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    marginTop: 10,
    marginHorizontal: 8,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: AppTheme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AppTheme.colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 24,
    height: 24,
  },
});
