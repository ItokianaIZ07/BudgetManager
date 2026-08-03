import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Header from "@/components/header";
import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import { router } from "expo-router";
import { resetDatabase, initDatabase, initializeData } from "@/database/sqlite";

export default function SettingsScreen() {
  const anneeActuelle = new Date().getFullYear();
  const clearData = () => {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir supprimer cette dépense ?\nLes dépenses supprimer ne pourrant plus être récuperé !",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            DepenseRepository.supprimerTout();
            router.push('/');
          }
        },
      ],
    );
  };

  const reconfigApp = ()=> {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir restaurer les configurations de base ?\nToutes vos modifications seront perdus !",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await resetDatabase();
            await initDatabase();
            await initializeData();
            router.push('/');
          }
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* <Header /> */}
      <View style={styles.cardContainer}>
        <Text style={styles.label}>Préferences</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.button} onPress={()=>router.push("/settings/category")}>
            <View style={styles.action}>
              <Text style={styles.buttonLabel}>
                Catégories
              </Text>
              <Image
                source={require("@/assets/images/category.png")}
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
                Restaures les configurations par défaut
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
          &copy; {anneeActuelle} - Budget Manager by ItokianaIZ07. Compte bien, dépense peu.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  cardContainer: {
    margin: 16,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  card: {
    display: "flex",
    flexDirection: "column"
  },
  action: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  button: {
    height: 56,
    display: "flex",
    justifyContent: "center",
    borderBlockColor: "black",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    paddingVertical: 8,
    marginVertical: 4,
  },
  label: {
    color: "#609bb4",
    fontSize: 10,
  },
  buttonLabel: {
    fontSize: 14,
    color: "#384069",
    fontWeight: "bold",
  },
  footer: {
    bottom: 0,
    display: "flex",
    alignItems: "center",
    padding: 8,
    justifyContent: "flex-end",
    flexDirection: "column",
  },
  footerLabel: {
    fontSize: 8,
    textAlign: "center",
    fontStyle: "italic",
  },
  icon:{
    width: 20, 
    height: 20
  }
});
