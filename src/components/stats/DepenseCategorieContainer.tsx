import { View, StatusBar, StyleSheet, Text, ScrollView, ProgressBarAndroidComponent} from "react-native";
import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import { useState } from "react";
import { useFocusEffect } from "expo-router";
import { Util } from "@/app/utils/util";
import ProgressBar from "./ProgressBar";

interface DepenseCategorieProps {
  mois: string;
  annee: string;
}

export default function DepenseCategorieContainer({
  mois,
  annee,
}: DepenseCategorieProps) {
  const [listDepense, setListDepense] = useState<any[]>([]);

  const getListDepensePerCategory = async () => {
    const depenses = await DepenseRepository.recupererSommeMontantParCategorie(
      mois,
      annee,
    );
    setListDepense(depenses !== undefined ? depenses : []);
  };

  const floatFormat = (nombre: number)=>{
    return nombre.toFixed(2);
  }

  const tempLimite = 500000;

  useFocusEffect(() => {
    getListDepensePerCategory();
  });
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catégories</Text>
      <ScrollView>
        {listDepense.map((item)=>(
            <View style={styles.card} key={item.id}>
                <View style={styles.info}>
                    <View style={styles.labelSection}>
                      <Text style={styles.categorieLabel}>{item.categorie}</Text>
                      <Text style={styles.limitLabel}>Limité à {Util.formatNumber(tempLimite)} Ar</Text>
                    </View>
                    <View style={styles.labelSection}>
                      <Text style={styles.montantLabel}>{item.total} Ar</Text>
                      <Text style={styles.limitLabel}>{floatFormat((item.total/tempLimite)*100)}% utilisé</Text>
                    </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <ProgressBar progress={item.total/tempLimite} color="#4a9d30" />
                </View>
            </View>
        ))}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{
    padding: 8
  },
  title:{
    fontSize: 16
  },
  card: {
    backgroundColor: "#FFF",
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    padding: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  labelSection:{
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  categorieLabel:{
    fontSize: 16,
    fontWeight: "bold",
    color: "#258f45"
  },
  limitLabel: {
    color: "#16689ea7",
    fontSize: 12
  },
  montantLabel: {
    fontSize: 18,
    color: "#16689e",
    fontWeight: "bold"
  },
  progressBarContainer: {
    marginVertical: 8
  }
});