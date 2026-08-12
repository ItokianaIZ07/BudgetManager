import { AppTheme } from "@/constants/theme";
import { NotificationType } from "@/models/Notification";
import { useStatsStore } from "@/store/statsStore";
import { Util, getCurrentDateParts, getPreviousMonthParts } from "@/utils/util";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function StatHeader() {
  const db = useSQLiteContext();
  const statsDepense = useStatsStore((state) => state.depenses);
  const [depensesParCategorieMoisActuel, setDepensesParCategorieMoisActuel] =
    useState<any[]>([]);
  const [
    depensesParCategorieMoisPrecedent,
    setDepensesParCategorieMoisPrecedent,
  ] = useState<any[]>([]);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const { mois, annee } = getCurrentDateParts();
    const { mois: moisPrecedent, annee: anneePrecedent } =
      getPreviousMonthParts();

    const fetchDepenses = async () => {
      try {
        const depensesActuelles = await useStatsStore
          .getState()
          .getDepensesParCategorie(db, mois, annee);
        const depensesPrecedentes = await useStatsStore
          .getState()
          .getDepensesParCategorie(db, moisPrecedent, anneePrecedent);

        setDepensesParCategorieMoisActuel(depensesActuelles || []);
        setDepensesParCategorieMoisPrecedent(depensesPrecedentes || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des dépenses par catégorie :",
          error,
        );
      }
    };

    fetchDepenses();
  }, []);

  const notifications = useMemo(() => {
    const list: NotificationType[] = [];
    for (let depense of statsDepense) {
      if (!depense.limite || depense.limite === 0) continue;

      const consommation = depense.total / depense.limite;
      let content = "";

      if (consommation >= 0.8 && consommation < 1) {
        content = `La consommation de la catégorie ${depense.categorie} a atteint plus de 80%.`;
      } else if (consommation === 1) {
        content = `La consommation de la catégorie ${depense.categorie} a atteint la limite de ${Util.formatNumber(depense.limite)} Ar`;
      } else if (consommation > 1) {
        content = `La consommation de la catégorie ${depense.categorie} a dépassé la limite de ${Util.formatNumber(depense.limite)} Ar`;
      }

      if (content.trim() !== "") {
        list.push({ type: "alert", content });
      }
    }

    const totalMoisActuel = depensesParCategorieMoisActuel.reduce(
      (acc, depense) => acc + Number(depense.total || 0),
      0,
    );
    const totalMoisPrecedent = depensesParCategorieMoisPrecedent.reduce(
      (acc, depense) => acc + Number(depense.total || 0),
      0,
    );

    if (totalMoisPrecedent > 0) {
      const difference = totalMoisActuel - totalMoisPrecedent;
      const pourcentage = (difference / totalMoisPrecedent) * 100;

      if (pourcentage > 5) {
        list.push({
          type: "info",
          content: `Les dépenses de ce mois sont supérieures de ${pourcentage.toFixed(1)}% par rapport au mois dernier.`,
        });
      }
    }

    const previousByCategory = depensesParCategorieMoisPrecedent.reduce(
      (acc, depense) => ({
        ...acc,
        [depense.categorie]: Number(depense.total || 0),
      }),
      {} as Record<string, number>,
    );

    const currentByCategory = depensesParCategorieMoisActuel.reduce(
      (acc, depense) => ({
        ...acc,
        [depense.categorie]: Number(depense.total || 0),
      }),
      {} as Record<string, number>,
    );

    const categories = new Set<string>([
      ...Object.keys(previousByCategory),
      ...Object.keys(currentByCategory),
    ]);

    categories.forEach((categorie) => {
      const currentTotal = currentByCategory[categorie] ?? 0;
      const previousTotal = previousByCategory[categorie] ?? 0;

      if (currentTotal === previousTotal) return;

      if (previousTotal === 0) {
        if (currentTotal > 0) {
          list.push({
            type: "info",
            content: `Dépenses pour ${categorie} ce mois : ${Util.formatNumber(currentTotal)} Ar, aucune dépense le mois précédent.`,
          });
        }
      } else {
        const differenceCategorie = currentTotal - previousTotal;
        const pourcentageCategorie =
          (differenceCategorie / previousTotal) * 100;
        const label = differenceCategorie >= 0 ? "augmenté" : "diminué";

        if (Math.abs(pourcentageCategorie) > 5) {
          list.push({
            type: "info",
            content: `Dépenses pour ${categorie} ont ${label} de ${Math.abs(pourcentageCategorie).toFixed(1)}% (${Util.formatNumber(Math.abs(differenceCategorie))} Ar) par rapport au mois dernier.`,
          });
        }
      }
    });

    return list;
  }, [
    statsDepense,
    depensesParCategorieMoisActuel,
    depensesParCategorieMoisPrecedent,
  ]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
      {
        scale: scale.value,
      },
    ],
  }));

  const ringBell = () => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 300 }),
        withTiming(20, { duration: 300 }),
        withTiming(0, { duration: 300 }),
      ),
      -1, // répétition infinie
      true,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 300 }),
      ),
      -1,
      true,
    );
  };

  const stopBell = () => {
    cancelAnimation(rotation);
    cancelAnimation(scale);
    rotation.value = 0;
    scale.value = 1;
  };

  const notificationsCount = notifications.length;

  useEffect(() => {
    if (notificationsCount > 0) {
      ringBell();
    }
  }, [notificationsCount]);

  return (
    <View style={styles.headerApp}>
      <View style={styles.headerTextBlock}>
        <Text style={styles.headerTitle}>Suivi de Budget</Text>
        <Text style={styles.headerSubtitle}>Gère tes dépenses en douceur</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.logoWrapper,
          {
            backgroundColor:
              notifications.length > 0
                ? "#fe4444be"
                : AppTheme.colors.primarySoft,
          },
        ]}
        onPress={() => {
          stopBell();
          router.push("/statistics/notification");
        }}
      >
        <Animated.View style={animatedStyle}>
          <Image
            source={require("@/assets/images/bell-ringing.png")}
            style={styles.logo}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerApp: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    marginTop: 10,
    marginHorizontal: 8,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTextBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: AppTheme.colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: AppTheme.colors.textMuted,
    marginTop: 2,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 24,
    height: 24,
  },
});
