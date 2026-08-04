import { CategorieRepository } from "@/app/repositories/CategorieRepository";
import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import Header from "@/components/header";
import { AppTheme } from "@/constants/theme";
import { Categorie } from "@/models/Categorie";
import { Depense } from "@/models/Depense";
import { useStatsStore } from "@/store/statsStore";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function AddExpenseScreen() {
  const [montant, setMontant] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categorieId, setCategorieId] = useState<number>(1);
  const [modePaiement, setModePaiement] = useState<string>("Espèce");
  const [listModePaiement, setListModePaiement] = useState<string[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const regex = /^\d+$/;
  const setStatDepense = useStatsStore((state)=>state.setDepenses);
  const date = new Date().toISOString().split("T")[0];
  const mois = date.split("-")[1];
  const annee = date.split("-")[0];

  function isValid(): boolean {
    try {
      return regex.test(montant);
    } catch (error) {
      return false;
    }
  }

  function isDescriptionNull() {
    return description.trim() === "";
  }

  function resetChamp(): void {
    setMontant("");
    setDescription("");
    setCategorieId(1);
    setModePaiement("Espèce");
  }

  const handleAjoute = async () => {
    if (!isValid()) {
      console.log(montant);
      Alert.alert("Veuillez remplir le montant en nombre positif");
      return;
    }

    if (isDescriptionNull()) {
      Alert.alert("Veuillez ajouter une description");
      return;
    }

    const depense: Depense = {
      montant: parseFloat(montant),
      description: description,
      categorie_id: categorieId,
      mode_paiement: modePaiement,
      date: new Date().toISOString().split("T")[0],
    };

    await DepenseRepository.ajouter(depense);
    const depenses = await DepenseRepository.recupererSommeMontantParCategorie(mois, annee);
    setStatDepense(depenses!== undefined ? depenses: []);
    Alert.alert("Votre dépense a bien été sauvegarder");
    resetChamp();
  };[]

  useEffect(() => {
    setListModePaiement(["Espèce", "Carte", "Virement"]);
  }, []);

  useFocusEffect(useCallback(() => {
    setCategories(CategorieRepository.recupererTous());
  }, []));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Nouvelle Dépense</Text>
          <Text style={styles.subtitle}>
            Saisissez les détails de votre transaction
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Montant</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#A0AEC0"
              keyboardType="numeric"
              value={montant}
              onChangeText={setMontant}
            />
            <Text style={styles.currencySymbol}>AR</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Achats supermarché..."
            placeholderTextColor="#A0AEC0"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Catégorie</Text>
          <View style={styles.pillsContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.pill,
                  categorieId === cat.id && styles.pillActive,
                ]}
                onPress={() => setCategorieId(cat.id!)}
              >
                <Text
                  style={[
                    styles.pillText,
                    categorieId === cat.id && styles.pillTextActive,
                  ]}
                >
                  {cat.libelle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mode de paiement</Text>
          <View style={styles.pillsContainer}>
            {listModePaiement.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.pill,
                  modePaiement === mode && styles.pillActive,
                ]}
                onPress={() => setModePaiement(mode)}
              >
                <Text
                  style={[
                    styles.pillText,
                    modePaiement === mode && styles.pillTextActive,
                  ]}
                >
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleAjoute}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Ajouter la dépense</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: AppTheme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 16,
    marginBottom: 16,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: AppTheme.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  amountInput: {
    fontSize: 32,
    fontWeight: "700",
    color: AppTheme.colors.text,
    flex: 1,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: "600",
    color: AppTheme.colors.textMuted,
    marginLeft: 8,
  },
  input: {
    fontSize: 16,
    color: AppTheme.colors.text,
    paddingVertical: 4,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: AppTheme.colors.surfaceMuted,
  },
  pillActive: {
    backgroundColor: AppTheme.colors.primary,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: AppTheme.colors.textMuted,
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: AppTheme.colors.primary,
    borderRadius: AppTheme.radius.md,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
    shadowColor: AppTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
