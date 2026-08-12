import { AppTheme } from "@/constants/theme";
import { useCategorieStore } from "@/store/categorieStore";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SortProps {
  onSort: (id: number) => void;
  onInput: (keyword: string) => void;
}

export default function SortComponent({ onSort, onInput }: SortProps) {
  const [filtre, setFiltre] = useState<number>(-1);
  const [options, setOptions] = useState<any[]>([]);
  const categories = useCategorieStore((state) => state.categories);
  const db = useSQLiteContext();

  useEffect(() => {
    setFiltre(-1);
    if (!categories || categories.length === 0) {
      useCategorieStore.getState().fetchCategories(db);
    }
    const opt = [{ id: -1, libelle: "Toutes" }, ...(categories || [])];
    setOptions(opt);
  }, [categories]);

  return (
    <View style={styles.container}>
      <View style={styles.filtreText}>
        <Image
          source={require("@/assets/images/search.png")}
          style={{ width: 24, height: 24 }}
        />
        <TextInput
          style={styles.keyWordInput}
          placeholder="Rechercher une transaction..."
          onChangeText={(value) => {
            (onInput(value), setFiltre(-1));
          }}
        />
      </View>
      <ScrollView
        horizontal={true}
        contentContainerStyle={styles.scrollContainer}
        showsHorizontalScrollIndicator={true}
      >
        {options.map((item) => (
          <View
            key={item.id}
            style={[styles.option, item.id === filtre && styles.focus]}
          >
            <TouchableOpacity
              onPress={() => {
                (onSort(item.id!), setFiltre(item.id!));
              }}
            >
              <Text
                style={
                  item.id === filtre
                    ? styles.focusLabel
                    : styles.optionDefaultLabel
                }
              >
                {item.libelle}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  option: {
    borderRadius: 999,
    backgroundColor: AppTheme.colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 6,
  },
  optionDefaultLabel: {
    color: AppTheme.colors.textMuted,
  },
  focus: {
    backgroundColor: AppTheme.colors.primary,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  focusLabel: {
    color: "white",
  },
  filtreText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 56,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.md,
    shadowColor: AppTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  keyWordInput: {
    fontSize: 16,
    fontWeight: "700",
    color: AppTheme.colors.text,
    flex: 1,
  },
  scrollContainer: {
    paddingTop: 4,
  },
});
