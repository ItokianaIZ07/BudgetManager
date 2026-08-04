import { AppTheme } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color?: string;
}

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            width: `${safeProgress * 100}%`,
            backgroundColor:
              color !== undefined ? color : AppTheme.colors.primary,
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
