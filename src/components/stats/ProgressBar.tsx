import { AppTheme } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  let barColor = "";
  if (color !== undefined) {
    barColor = color;
  } else {
    if (progress < 0.5) {
      barColor = AppTheme.colors.secondary;
    } else if (progress >= 0.5 && progress <= 0.8) {
      barColor = AppTheme.colors.accent;
    } else {
      barColor = AppTheme.colors.danger;
    }
  }
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            width: `${safeProgress * 100}%`,
            backgroundColor: barColor,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 10,
    backgroundColor: AppTheme.colors.surfaceMuted,
    borderRadius: 999,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 999,
  },
});
