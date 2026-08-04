import { Util } from "@/app/utils/util";
import { AppTheme } from "@/constants/theme";
import { Depense } from "@/models/Depense";
import { StyleSheet, Text, View } from "react-native";
import DeleteButton from "./DeleteButton";

interface HistoryCardProps {
  item: Depense;
  onDelete: (id: number) => void;
}

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.date}>{Util.formatDate(item.date)}</Text>
      </View>
      <Text style={styles.price}>{Util.formatNumber(item.montant)} Ar</Text>
      <DeleteButton item={item} onDelete={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: AppTheme.colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  price: {
    fontSize: 22,
    color: AppTheme.colors.primary,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: 8,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 14,
    marginBottom: 12,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    marginHorizontal: 8,
    alignItems: "center",
  },
  date: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
  },
});
