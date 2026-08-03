import { CategorieRepository } from "@/app/repositories/CategorieRepository";
import { LimiteDepenseRepository } from "@/app/repositories/LimiteDepenseRepository";
import { Categorie } from "@/models/Categorie";
import { LimiteDepense } from "@/models/LimiteDepense";
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
  onRefresh?: ()=>void
}

export default function FormModal({
  visible,
  setVisible,
  mode,
  setMode,
  categorie,
  setCategorie,
  onRefresh
}: FormModalProps) {
  const [nom, setNom] = useState<string>("");
  const [limite, setLimite] = useState<string>("");

  const saveCategory = async (category: Categorie) => {
    const idInserted = await CategorieRepository.sauvegarderCategorie(category);
    const limiteDepense: LimiteDepense = {
      idCategorie: idInserted,
      limite: category.limite!
    }
    await LimiteDepenseRepository.sauvegarderLimite(limiteDepense);
  };

  const updateCategory = async (category: Categorie) => {
    CategorieRepository.mettreAJourCategorie(category);
    await LimiteDepenseRepository.mettreAJourLimite(category);
  };

  const save = () => {
    let category: Categorie = { libelle: "" };
    let message: string = "";
    try {
      if (mode == "add") {
        if (nom.trim() === "") {
          Alert.alert("Veuillez entrez un nom pour la catégorie");
          return;
        }
        if(limite.trim() === ""){
          Alert.alert("Veuillez entrez une limite de dépense pour la catégorie");
          return;
        }
        category = { libelle: nom, limite: parseFloat(limite)};
        saveCategory(category);
        message = "Categorie sauvegardé avec succès";
      } else if (mode == "edit") {
        if(nom.trim() === ""){
          setNom(categorie!.libelle!);
        }
        if(limite.trim() === ""){
          setLimite(categorie!.limite!.toString());
        }
        category = { id: categorie?.id, libelle: nom, limite: parseFloat(limite) };
        updateCategory(category);
        message = "La categorie a été mis à jour";
      }
      hideModal();
      Alert.alert(message);
      onRefresh?.();
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
    setNom("");
    setLimite("");
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.form}>
        <View style={styles.formContent}>
          <Text>
            {mode == "add" ? "Nouvelle catégorie" : "Modifier la catégorie"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={mode === "add"? "Nom": categorie!.libelle}
            value={nom}
            onChangeText={setNom}
          />
          <TextInput
            style={styles.input}
            inputMode="numeric"
            placeholder={mode === "add"? "100 000 Ar": categorie!.limite?.toString()}
            value={limite}
            onChangeText={setLimite}
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
    display: "flex",
    flexDirection: "column",
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
    marginVertical: 4
  },
});
