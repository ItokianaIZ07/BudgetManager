import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { DepenseRepository } from "./repositories/DepenseRepository";
import { Depense } from "@/models/Depense";
import { router, useFocusEffect } from "expo-router";
import HistoryCard from "@/components/history/HistoryCard";
import {Picker} from "@react-native-picker/picker"

export default function PageAccueil() {
  const [estPret, setEstPret] = useState<boolean>(false);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [depenseFiltre, setDepenseFiltre] = useState<Depense[]>(depenses);

  const dateActuelle = new Date();

  const moisCourant = String(dateActuelle.getMonth()+1).padStart(2, '0');
  const anneeCourante = String(dateActuelle.getFullYear());

  const [mois, setMois] = useState<string>(moisCourant);
  const [annee, setAnnee] = useState<string>(anneeCourante);

  const listMois = [
    {valeur:"01",label:"Janvier"},
    {valeur:"02",label: "Févirer"},
    {valeur:"03",label: "Mars"},
    {valeur:"04",label: "Avril"},
    {valeur:"05",label: "Mai"},
    {valeur:"06",label: "Juin"},
    {valeur:"07",label: "Juillet"},
    {valeur:"08",label: "Août"},
    {valeur:"09",label: "Septembre"},
    {valeur:"10",label: "Octobre"},
    {valeur:"11",label: "Novembre"},
    {valeur:"12",label: "Décembre"}
  ];

  const listAnnee = [];
  for(let a = parseInt(anneeCourante) - 5; a <= parseInt(anneeCourante); a++){
    listAnnee.push({
      key:a + 5 - parseInt(anneeCourante), valeur:a.toString()
    });
  }

  function getMois(indice: string): string{
    return listMois.find(v=>v.valeur == indice)!.valeur;
  }

  const filtrerDepense = () : void =>{
    setDepenseFiltre((depenses)=> depenses.filter(d=> d.date.startsWith(annee+"-"+mois)));
  }

  const total = useMemo(() => {
    return depenses.reduce((somme, item) => somme + item.montant, 0);
  }, [depenses]);

  const rechargeDepense = (id: number) => {
    setDepenses((depenses) => depenses.filter((item) => item.id !== id));
  };

  async function chargerDepenses() {
    const donnees = await DepenseRepository.recupererToutes();
    setDepenses(donnees);
  }

  async function supprimerDepense(id: number) {
    await DepenseRepository.supprimerDepense(id);
    rechargeDepense(id);
  }

  const confirmerSuppression = (id: number) => {
    Alert.alert(
      "Confirmer la suppression",
      "Es-tu sûr de vouloir supprimer cette dépense ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => supprimerDepense(id),
        },
      ],
    );
  };

  useEffect(() => {
    const preparerApplication = async () => {
      try {
        // await initDatabase();
        // await db.runAsync("DELETE FROM depenses");
        // const depense : Depense = {
        //   montant: 15000,
        //   description: "Achat repas midi",
        //   date: "2026-07-21",
        //   categorie_id: 1,
        //   mode_paiement: "Epsèce"
        // };
        // const generatedId = await DepenseRepository.ajouter(depense);
        // console.log(generatedId);
      } catch (erreur) {
        console.error("Erreur au chargement :", erreur);
      } finally {
        setEstPret(true);
      }
    };
    preparerApplication();
  }, []);

  useEffect(()=>{
    filtrerDepense();
  }, [mois, annee]);

  useFocusEffect(
    useCallback(() => {
      chargerDepenses();
      filtrerDepense();
    }, []),
  );

  if (!estPret) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initialisation de la base de données...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.headerApp}>
        <Text style={styles.headerTitle}>Suivie de Budget</Text>
        <Image
          source={require("@/assets/images/tabIcons/currency-manat.png")}
          style= {styles.logo}
        />
      </View>
      {/* <View>
        <Text>Filtre</Text>
        <View>
          <View>
            <Text>Mois</Text>
            <Picker
              selectedValue={getMois(moisCourant)}
              onValueChange={(itemValue)=>setMois(itemValue)}
            >
              {listMois.map((m)=>(
                <Picker.Item
                  key={m.valeur}
                  label={m.label}
                  value={m.valeur}
                />
              ))}
            </Picker>
          </View>
          <View>
            <Text>Année</Text>
            <Picker
              selectedValue={anneeCourante}
              onValueChange={(itemValue)=>setAnnee(itemValue)}
            >
              {listAnnee.map((a)=>(
                <Picker.Item
                  key={a.key}
                  label={a.valeur}
                  value={a.valeur}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View> */}
      <FlatList
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Total des depenses</Text>
            <Text style={styles.price}>{total} Ar</Text>
          </View>
        )}
        data={depenses}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <HistoryCard item={item} onDelete={confirmerSuppression} />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyComponent}>
            <Text style={styles.label}>Aucune dépense enregistrée</Text>
            <Button
              title="Ajouter une dépense"
              onPress={() => router.push("/depense")}
            />
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
  headerApp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#e1e1e1",
    marginTop: 10,
    alignItems: "center"
  },
  logo: {
    width: 32,
    height: 32,
    backgroundColor: "#16689e84",
    borderRadius: 50
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16689e"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A202C",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  price: {
    fontSize: 24,
    color: "#2f62a0",
    fontWeight: "bold",
    marginLeft: "auto",
  },
  centre: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyComponent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    display: "flex",
    flexDirection: "row",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A0AEC0",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
});
