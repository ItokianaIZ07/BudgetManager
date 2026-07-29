import { Depense } from "@/models/Depense";
import { TouchableOpacity, View, Image, StyleSheet, Alert } from "react-native";

interface DeleteButtonProps {
  item: Depense;
  onDelete: (id: number) => void;
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
          onPress: () => onDelete(id),
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
    display: "flex",
    alignItems: "center",
    width: 32,
    padding: 8,
  },
});
