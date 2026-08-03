import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Image,
  ScrollView
} from "react-native";
import Header from "@/components/header";
import DepenseCategorieContainer from "@/components/stats/DepenseCategorieContainer";
import { useState } from "react";
import { useFocusEffect } from "expo-router";
import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import { getMonth, Util } from "@/app/utils/util";

export default function StatisticsScreen() {
  const [depenseMoisActuelle, setDepenseMoisActuelle] = useState<number>(0);
  const dateActuelle = new Date().toISOString().split("T")[0];
  const mois = dateActuelle.split("-")[1];
  const annee = dateActuelle.split("-")[0];

  const getDepenseDuMois = async () => {
    const montant = await DepenseRepository.recupererSommeParMoisAnnee(mois,annee);
    setDepenseMoisActuelle(montant !== null ? montant.total : 0);
  };

  useFocusEffect(() => {
    getDepenseDuMois();
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header />
      <View style={styles.depenseContainer}>
        <View style={styles.depenseLabelContainer}>
          <Text style={styles.depenseLabel}>
            Dépense de ce mois : {getMonth(mois)}
          </Text>
          <Text style={[styles.depenseLabel, styles.depenseValue]}>
            {Util.formatNumber(depenseMoisActuelle)} Ar
          </Text>
        </View>
        <View>
          <Image
            source={require("@/assets/images/cash.png")}
            style={styles.cashIcon}
          />
        </View>
      </View>
      <DepenseCategorieContainer mois={mois} annee={annee} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  depenseContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    margin: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#258f45",
    borderRadius: 8,
    alignItems: "center",
    height: 80,
  },
  depenseLabelContainer: {
    display: "flex",
    flexDirection: "column",
  },
  depenseLabel: {
    color: "#ffffffd1",
  },
  depenseValue: {
    fontWeight: "bold",
    fontSize: 28,
  },
  cashIcon: {
    width: 40,
    height: 40,
  },
});
