import { CategorieRepository } from "@/app/repositories/CategorieRepository";
import { LimiteDepenseRepository } from "@/app/repositories/LimiteDepenseRepository";
import { AppTheme } from "@/constants/theme";
import { Categorie } from "@/models/Categorie";
import { LimiteDepense } from "@/models/LimiteDepense";
import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface FormModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  mode: string;
  setMode: (mode: string) => void;
  categorie?: Categorie;
  setCategorie: (categorie?: Categorie) => void;
  onRefresh?: () => void;
}

export default function FormModal({
  visible,
  setVisible,
  mode,
  setMode,
  categorie,
  setCategorie,
  onRefresh,
}: FormModalProps) {
  const [nom, setNom] = useState<string>("");
  const [limite, setLimite] = useState<string>("");

  const saveCategory = async (category: Categorie) => {
    const idInserted = await CategorieRepository.sauvegarderCategorie(category);
    const limiteDepense: LimiteDepense = {
      idCategorie: idInserted,
      limite: category.limite!,
    };
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
        if (limite.trim() === "") {
          Alert.alert(
            "Veuillez entrez une limite de dépense pour la catégorie",
          );
          return;
        }
        category = { libelle: nom, limite: parseFloat(limite) };
        saveCategory(category);
        message = "Categorie sauvegardé avec succès";
      } else if (mode == "edit") {
        if (nom.trim() === "") {
          setNom(categorie!.libelle!);
        }
        if (limite.trim() === "") {
          setLimite(categorie!.limite!.toString());
        }
        category = {
          id: categorie?.id,
          libelle: nom,
          limite: parseFloat(limite),
        };
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
          <Text style={styles.title}>
            {mode == "add" ? "Nouvelle catégorie" : "Modifier la catégorie"}
          </Text>
          <Text style={styles.label}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder={mode === "add" ? "Nom" : categorie!.libelle}
            placeholderTextColor={AppTheme.colors.textMuted}
            value={nom}
            onChangeText={setNom}
          />
          <Text style={styles.label}>Limite de dépense mensuel</Text>
          <TextInput
            style={styles.input}
            inputMode="numeric"
            placeholder={
              mode === "add" ? "100 000 Ar" : categorie!.limite?.toString()
            }
            placeholderTextColor={AppTheme.colors.textMuted}
            value={limite}
            onChangeText={setLimite}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={save}>
              <Text style={styles.primaryButtonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={hideModal}
            >
              <Text style={styles.secondaryButtonText}>Annuler</Text>
            </TouchableOpacity>
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
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  formContent: {
    margin: 20,
    padding: 20,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: AppTheme.colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: AppTheme.colors.textMuted,
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  buttonContainer: {
    flexDirection: "column",
    gap: 10,
    marginTop: 16,
  },
  input: {
    backgroundColor: AppTheme.colors.surfaceMuted,
    borderRadius: AppTheme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 4,
    color: AppTheme.colors.text,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.primary,
    paddingVertical: 12,
    borderRadius: AppTheme.radius.md,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: AppTheme.colors.surfaceMuted,
    paddingVertical: 12,
    borderRadius: AppTheme.radius.md,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: AppTheme.colors.text,
    fontWeight: "600",
  },
});
