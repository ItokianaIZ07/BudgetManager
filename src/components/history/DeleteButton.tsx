import { Depense } from "@/models/Depense";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";

interface DeleteButtonProps {
  item: Depense;
  onDelete: (item: Depense) => void;
}

export default function DeleteButton({ item, onDelete }: DeleteButtonProps) {
  const confirmerSuppression = (id: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir supprimer cette dépense ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => onDelete(item),  
        },
      ],
    );
  };

  return (
    <TouchableOpacity onPress={() => confirmerSuppression(item.id!)}>
      <View style={styles.icon}>
        <Image
          source={require("@/assets/images/trash.png")}
          style={{ width: 24, height: 24 }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
  },
});
