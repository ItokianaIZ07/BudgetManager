import { Depense } from "@/models/Depense";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { Util } from "@/app/utils/util";
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
    color: "#1A202C",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  price: {
    fontSize: 24,
    color: "#16689e",
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: 8
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 8,
    alignItems: "center"
  },
  date:{
    fontSize: 8,
  },
});
