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

export default function Notification() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.alertContainer}>
        <View style={styles.labelContainer}>
          <ScrollView>
            <Text style={styles.label}>Test</Text>
          </ScrollView>
        </View>
        <View>
          <Image
            source={require("@/assets/images/alert-circle.png")}
            style={styles.icon}
          />
        </View>
      </View>
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
