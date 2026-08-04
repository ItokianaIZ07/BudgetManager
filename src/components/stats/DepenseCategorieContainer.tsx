import { Util } from "@/app/utils/util";
import { AppTheme } from "@/constants/theme";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import ProgressBar from "./ProgressBar";

interface DepenseCategorieProps {
  listDepense: any[];
}

export default function DepenseCategorieContainer({listDepense,}: DepenseCategorieProps) {

  const floatFormat = (nombre: number) => {
    return nombre.toFixed(2);
  };

  if (listDepense.length == 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyLabel}>
          Aucune dépense enregistré pour le moment
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <Text style={styles.title}>Catégories({listDepense.length})</Text>
      {listDepense.map((item) => (
        <View style={styles.card} key={item.id}>
          <View style={styles.info}>
            <View style={styles.labelSection}>
              <Text style={styles.categorieLabel}>{item.categorie}</Text>
              <Text style={styles.limitLabel}>
                Limité à {Util.formatNumber(item.limite)} Ar
              </Text>
            </View>
            <View style={styles.labelSection}>
              <Text style={styles.montantLabel}>
                {Util.formatNumber(item.total)} Ar
              </Text>
              <Text style={styles.limitLabel}>
                {floatFormat((item.total / item.limite) * 100)}% utilisé
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar
              progress={item.total / item.limite}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: AppTheme.colors.text,
    marginBottom: 4,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    flexDirection: "column",
    borderRadius: AppTheme.radius.md,
    padding: 12,
    marginVertical: 8,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelSection: {
    flexDirection: "column",
    gap: 4,
  },
  categorieLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppTheme.colors.secondary,
  },
  limitLabel: {
    color: AppTheme.colors.textMuted,
    fontSize: 12,
  },
  montantLabel: {
    fontSize: 18,
    color: AppTheme.colors.primary,
    fontWeight: "bold",
  },
  progressBarContainer: {
    marginVertical: 8,
  },
  emptyLabel: {
    color: AppTheme.colors.textMuted,
  },
  scrollContainer: {
    // flex: 1,
    backgroundColor: AppTheme.colors.background,
    padding: 8,
  },
});
