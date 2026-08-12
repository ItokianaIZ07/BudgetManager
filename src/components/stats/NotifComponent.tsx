import { AppTheme } from "@/constants/theme";
import { Util } from "@/utils/util";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface NotifComponentProps {
  listDepense: any[];
}

export default function NotifComponent({ listDepense }: NotifComponentProps) {
  const [notification, setNotification] = useState<string>("");

  const checkLimit = () => {
    const message: string[] = [];
    for (let depense of listDepense) {
      const consommation = depense.total / depense.limite;
      let notif = "";
      if (consommation >= 0.8 && consommation < 1) {
        notif = `La consommation de la catégorie ${depense.categorie} a atteint plus de 80%.`;
      } else if (consommation == 1) {
        notif = `La consommation de la catégorie ${depense.categorie} a atteint la limite de ${Util.formatNumber(depense.limite)} Ar`;
      } else if (consommation > 1) {
        notif = `La consommation de la catégorie ${depense.categorie} a dépassé la limite de ${Util.formatNumber(depense.limite)} Ar`;
      }
      if (notif.trim() !== "") {
        message.push(notif);
      }
    }
    if (message.length > 0) {
      const alert = message.toString().replaceAll(",", "\n\n");
      setNotification(alert);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkLimit();
    }, []),
  );

  return (
    notification.trim() !== "" && (
      <View style={styles.alertContainer}>
        <View style={styles.labelContainer}>
          <ScrollView>
            <Text style={styles.label}>{notification}</Text>
          </ScrollView>
        </View>
        <View>
          <Image
            source={require("@/assets/images/alert-circle.png")}
            style={styles.icon}
          />
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  alertContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.dangerSoft,
    borderRadius: AppTheme.radius.md,
    padding: AppTheme.spacing.sm,
    maxHeight: 100,
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  labelContainer: {
    width: "70%",
  },
  label: {
    color: "#800000",
  },
});
