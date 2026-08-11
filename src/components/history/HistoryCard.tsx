import { AppTheme } from "@/constants/theme";
import { Depense } from "@/models/Depense";
import { useCategorieStore } from "@/store/categorieStore";
import { Util } from "@/utils/util";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import DeleteButton from "./DeleteButton";

interface HistoryCardProps {
  item: Depense;
  onDelete: (id: number) => void;
}

export default function HistoryCard({ item, onDelete }: HistoryCardProps) {
  const categories = useCategorieStore((s) => s.categories);
  const getCategorie = (id: number) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.libelle ?? "";
  };

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
      opacity: opacity.value,
    };
  });

  const animeSuppression = (item: Depense) => {
    translateX.value = withTiming(500, {
      duration: 300,
    });

    opacity.value = withTiming(
      0,
      {
        duration: 300,
      },
      (finished) => {
        if (finished) {
          scheduleOnRN(onDelete, item.id!);
        }
      },
    );
  };

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View>
        <Text style={styles.title}>{item.description}</Text>
        <Text style={styles.date}>
          {getCategorie(item.categorie_id)} . {Util.formatDate(item.date)}
        </Text>
      </View>
      <Text style={styles.price}>{Util.formatNumber(item.montant)} Ar</Text>
      <DeleteButton item={item} onDelete={animeSuppression} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: AppTheme.colors.text,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.textMuted,
    marginTop: 4,
  },
  price: {
    fontSize: 22,
    color: AppTheme.colors.primary,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: 8,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: 14,
    marginBottom: 12,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: "row",
    marginHorizontal: 8,
    alignItems: "center",
  },
  date: {
    fontSize: 11,
    color: AppTheme.colors.textMuted,
  },
});
