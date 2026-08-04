import {
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { AppTheme } from "@/constants/theme";
import { NotificationType } from "@/models/Notification";
import { useStatsStore } from "@/store/statsStore";
import { Util } from "@/app/utils/util";

export default function Notification() {
  const notifications: NotificationType[] = [];
  const depenses = useStatsStore(state=>state.depenses);

  for (let depense of depenses) {
    const consommation = depense.total / depense.limite;
    const notif : NotificationType = {
      type: "alert",
      content : ""
    };
    if (consommation >= 0.8 && consommation < 1) {
      notif.content = `La consommation de la catégorie ${depense.categorie} a atteint plus de 80%.`;
    } else if (consommation == 1) {
      notif.content = `La consommation de la catégorie ${depense.categorie} a atteint la limite de ${Util.formatNumber(depense.limite)} Ar`;
    }
    else if (consommation > 1){
      notif.content = `La consommation de la catégorie ${depense.categorie} a dépassé la limite de ${Util.formatNumber(depense.limite)} Ar`;
    }
    if (notif.content.trim() !== "") {
      notifications.push(notif);
    }
  }

  if (notifications.length == 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyLabel}>
          Aucune notification pour le moment
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {notifications.map((item) => (
          <View
            key={item.content}
            style={[
              styles.alertContainer,
              item.type === "alert" ? styles.alert : styles.info,
            ]}
          >
            <View style={styles.labelContainer}>
              <Text
                style={
                  item.type === "alert" ? styles.alertLabel : styles.infoLabel
                }
              >
                {item.content}
              </Text>
            </View>
            <View>
              <Image
                source={require("@/assets/images/alert-circle.png")}
                style={styles.icon}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.colors.background,
  },
  alertContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: AppTheme.radius.md,
    padding: AppTheme.spacing.sm,
    alignItems: "center",
    height: 64,
    borderLeftWidth: 2,
  },
  icon: {
    width: 32,
    height: 32,
  },
  labelContainer: {
    width: "70%",
  },
  alertLabel: {
    color: "#800000",
  },
  infoLabel: {
    color: AppTheme.colors.primary,
  },
  scrollContainer: {
    padding: AppTheme.spacing.md,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  alert: {
    borderLeftColor: AppTheme.colors.danger,
    backgroundColor: AppTheme.colors.dangerSoft,
  },
  info: {
    borderLeftColor: AppTheme.colors.primary,
    backgroundColor: "#2564eb17",
  },
  empty: {
    margin: 8,
  },
  emptyLabel: {
    color: AppTheme.colors.textMuted,
  },
});
