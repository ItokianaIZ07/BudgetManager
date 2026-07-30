import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import {
  FlatList,
  Alert,
  Text,
  Button,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Depense } from "@/models/Depense";
import { useState } from "react";
import { useFocusEffect } from "expo-router";
import HistoryCard from "@/components/history/HistoryCard";
import { router } from "expo-router";
import HistoryHeader from "@/components/history/HistoryHeader";
import SortComponent from "@/components/history/SortComponent";
import Header from "@/components/header";

export default function HistoryScreen() {
  const [depenses, setDepenses] = useState<Depense[]>([]);

  const rechargeDepense = (id: number) => {
    setDepenses((depenses) => depenses.filter((item) => item.id !== id));
  };

  async function chargerDepenses() {
    const donnees = await DepenseRepository.recupererToutes();
    setDepenses(donnees);
  }

  async function supprimerDepense(id: number) {
    await DepenseRepository.supprimerDepense(id);
    rechargeDepense(id);
  }


  const sortById = async (id: number) =>{
    if(id <= 0){
        await chargerDepenses();
        return;
    }
    const donnees = await DepenseRepository.recupererParCategorie(id);
    setDepenses(donnees);
  }

  const searchByKeyWord = async (keyword: string)=>{
    if(keyword.trim() === ""){
        await chargerDepenses();
        return;
    }
    const donnees = await DepenseRepository.rechercherParMotCle(keyword);
    // const donnees = depenses.filter((d)=>d.description.toLowerCase().startsWith(keyword.toLowerCase()))
    setDepenses(donnees);
  }

  useFocusEffect(() => {
    sortById(-1);
  });


  return (
    <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <Header/>
    {/* <HistoryHeader depenses={depenses} /> */}
    <SortComponent onSort={sortById} onInput={searchByKeyWord}/>
    <FlatList
        ListHeaderComponent={()=>(
            <View style={styles.headerApp}>
                <Text style={styles.headerTitle}>Historique ({depenses.length})</Text>
            </View>
        )}
      data={depenses}
      keyExtractor={(item) => item.id!.toString()}
      renderItem={({ item }) => (
        <HistoryCard item={item} onDelete={supprimerDepense} />
      )}
      ListEmptyComponent={() => (
          <View style={styles.emptyComponent}>
          <Text style={styles.label}>Aucune dépense enregistrée pour cette catégorie</Text>
          <Button
            title="Ajouter une dépense"
            onPress={() => router.push("/depense")}
          />
        </View>
      )}
      ></FlatList>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  emptyComponent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  headerApp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16689e"
  },
});
