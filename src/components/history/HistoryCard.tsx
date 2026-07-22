import {
  View,
  Text,
  StyleSheet,
  Alert,
} from "react-native";

export default function HistoryCard(
  montant: number,
  label: string,
  date: string,
  description: string,
) {
  return (
    <View style={styles.card}>
        <Text style={styles.label}>{description}</Text>
        <Text style={styles.label}>{date}</Text>
        <Text style={styles.label}>{montant}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#A0AEC0",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 8,
    },
})