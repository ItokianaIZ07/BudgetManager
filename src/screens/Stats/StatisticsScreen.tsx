import DepenseCategorieContainer from "@/components/stats/DepenseCategorieContainer";
import { AppTheme } from "@/constants/theme";
import { useStatsStore } from "@/store/statsStore";
import { getMonth, Util } from "@/utils/util";
import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function StatisticsScreen() {
  const db = useSQLiteContext();
  const [depenseMoisActuelle, setDepenseMoisActuelle] = useState<number>(0);
  const listDepense = useStatsStore((state) => state.depenses);

  const dateActuelle = new Date().toISOString().split("T")[0];
  const mois = dateActuelle.split("-")[1];
  const annee = dateActuelle.split("-")[0];

  const getDepenseDuMois = async () => {
    const montant = await useStatsStore
      .getState()
      .fetchTotalForMonth(db, mois, annee);
    setDepenseMoisActuelle(montant);
  };

  useFocusEffect(
    useCallback(() => {
      getDepenseDuMois();
    }, []),
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.depenseContainer}>
        <View style={styles.depenseLabelContainer}>
          <Text style={styles.depenseLabel}>
            Dépense de ce mois :{" "}
            <Text style={{ fontWeight: "bold" }}>{getMonth(mois)}</Text>
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
      <DepenseCategorieContainer listDepense={listDepense} />
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
    backgroundColor: AppTheme.colors.primary,
    borderRadius: 8,
    alignItems: "center",
    height: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
