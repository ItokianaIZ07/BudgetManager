import { CategorieRepository } from "@/app/repositories/CategorieRepository";
import { Categorie } from "@/models/Categorie";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Text,
  Platform,
  FlatList,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";

export default function CategoryScreen() {
  const [categories, setCategories] = useState<Categorie[]>([]);

  const loadCategories = ()=>{
    setCategories(CategorieRepository.recupererTous());
  }

  const deleteCategory = (id: number)=>{
    Alert.alert(
          "Confirmer la suppression",
          "Es-tu sûr de vouloir supprimer catégorie ?",
          [
            { text: "Annuler", style: "cancel" },
            {
              text: "Supprimer",
              style: "destructive",
              onPress: async () =>{
                await CategorieRepository.supprimerCategorie(id);
                loadCategories()
              },
            },
          ],
        );
  };

  useFocusEffect(useCallback(()=>{
    loadCategories();
  }, []))

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableOpacity style={styles.addContainer}>
        <Image
          source={require("@/assets/images/tabIcons/square-plus.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
      <FlatList
        style={styles.catContainer}
        ListHeaderComponent={()=>(
            <View>
                <Text style={styles.label}>Liste des catégories ({categories.length})</Text>
            </View>
        )}
        data={categories}
        keyExtractor={(item) => item.libelle}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            <Text style={styles.categoryLabel}>{item.libelle}</Text>
            <View style={styles.action}>
              <TouchableOpacity onPress={()=>deleteCategory(item.id!)} style={[styles.actionContent, styles.actionDelete]}>
                <Image 
                  source={require("@/assets/images/trash.png")}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionContent, styles.actionEdit]}>
                <Image 
                  source={require("@/assets/images/pencil.png")}
                  style={styles.actionIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  addContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#60addd",
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderRadius: 4,
    margin: 8
  },
  catContainer:{
    margin: 8,
    display: "flex",
    flexDirection: "column",
    borderRadius: 8,
    gap: 8
  },
  categoryCard: {
    padding: 8,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor:"#FFF",
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    height: 56,
    alignItems: "center"
  },
  categoryLabel : {
    fontSize: 18,
    color: "#213755",
    // fontWeight: "bold"
  },
  label: {
    color: "#609bb4",
    fontSize: 12,
  },
  icon: {
    width: 40,
    height: 40,
  },
  action: {
    display: "flex",
    flexDirection: "row",
    gap: 4,
    width: 64,
    height: 40,
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8
  },
  actionContent:{
    width:32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    shadowColor: "#333333",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionDelete: {
    backgroundColor: "#e4c2c2c0"
  },
  actionEdit: {
    backgroundColor: "#8dcced"
  },
  actionIcon: {
    width: 20,
    height: 20
  }
});
