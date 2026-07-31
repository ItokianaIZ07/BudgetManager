import { CategorieRepository } from "@/app/repositories/CategorieRepository";
import { Categorie } from "@/models/Categorie";
import { useFocusEffect } from "expo-router";
import { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Alert,
} from "react-native";

interface FormModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  setMode: (mode: string) => void;
  categorie?: Categorie;
  setCategorie: (categorie?: Categorie) => void;
}

export default function FormModal({
  visible,
  setVisible,
  mode,
  setMode,
  categorie,
  setCategorie,
}: FormModalProps) {
  const [nom, setNom] = useState<string>("");

  const saveCategory = async (category: Categorie) => {
    CategorieRepository.sauvegarderCategorie(category);
  };

  const updateCategory = async (category: Categorie) => {
    CategorieRepository.mettreAJourCategorie(category);
  };

  const save = () => {
    if (nom.trim() === "") {
      Alert.alert("Veuillez entrez un nom pour la catégorie");
      return;
    }
    let category: Categorie = { libelle: "" };
    let message: string = "";
    try {
      if (mode == "add") {
        category = { libelle: nom };
        saveCategory(category);
        message = "Categorie sauvegarder avec succès";
      } else if (mode == "edit") {
        category = { id: categorie?.id, libelle: nom };
        updateCategory(category);
        message = "La categorie a été mis à jour";
      }
      Alert.alert(message);
    } catch (error) {
      console.error(
        `Une erreur est survenue lors du mode: ${mode}\nError: ${error}`,
      );
    }
  };

  const hideModal = () => {
    setCategorie();
    setMode("add");
    setVisible(false);
  };

  useFocusEffect(()=>{
    setNom(mode == "add" ? "" : categorie!.libelle);
  })

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.form}>
        <View style={styles.formContent}>
          <Text>
            {mode == "add" ? "Nouvelle catégorie" : "Modifier la catégorie"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
          <View style={styles.buttonContainer}>
            <Button title="Enregistrer" onPress={save} />
            <Button onPress={hideModal} title="Annuler" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  form: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  formContent: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#bdbdbd5a",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
});
