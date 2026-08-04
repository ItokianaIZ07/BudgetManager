import { AppTheme } from "@/constants/theme";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useStatsStore } from "@/store/statsStore";
import { useEffect, useMemo, useState } from "react";
import { NotificationType } from "@/models/Notification";
import { Util } from "@/app/utils/util";

export default function StatHeader() {
  const statsDepense = useStatsStore((state) => state.depenses);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

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
    return list;
  }, [statsDepense]);

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

  scale.value = withSequence(
    withTiming(1.2, { duration: 120 }),
    withTiming(1, { duration: 120 }),
  );

  rotation.value = withSequence(
    withTiming(-45, { duration: 100 }),
    withTiming(45, { duration: 100 }),
    withTiming(0, { duration: 100 }),
  );

  const ringBell = () => {
    rotation.value = withSequence(
      withTiming(-20, { duration: 70 }),
      withTiming(20, { duration: 70 }),
      withTiming(-15, { duration: 70 }),
      withTiming(15, { duration: 70 }),
      withTiming(-8, { duration: 70 }),
      withTiming(8, { duration: 70 }),
      withTiming(0, { duration: 70 }),
    );
    scale.value = withSequence(
      withTiming(1.2, { duration: 120 }),
      withTiming(1, { duration: 120 }),
    );
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
                ? AppTheme.colors.dangerSoft
                : AppTheme.colors.primarySoft,
          },
        ]}
        onPress={() => {
          ringBell();
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
