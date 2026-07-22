import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { initDatabase, db } from '@/database/sqlite'; 
import { DepenseRepository } from './repositories/DepenseRepository';
import { Depense } from '@/models/Depense';
import { router, useFocusEffect } from 'expo-router';
import HistoryCard from '@/components/history/HistoryCard';

export default function PageAccueil() {
  const [estPret, setEstPret] = useState<boolean>(false);
  const [depenses, setDepenses] = useState<Depense[]>([]);

  const total = useMemo(()=>{
    return depenses.reduce((somme, item)=> somme + item.montant, 0);
  }, [depenses]);

  const rechargeDepense = (id: number) => {
    setDepenses((depenses)=> depenses.filter((item)=> item.id !== id));
  }
  
  async function chargerDepenses() {
    const donnees = await DepenseRepository.recupererToutes();
    setDepenses(donnees);
  }

  async function supprimerDepense(id: number){
    await DepenseRepository.supprimerDepense(id);
    rechargeDepense(id);
  }
  
  const confirmerSuppression = (id: number) => {
    Alert.alert("Confirmer la suppression", "Es-tu sûr de vouloir supprimer cette dépense ?", 
      [
        {text: "Annuler", style: "cancel"},
        {
          text: "Supprimer",
          style: "destructive",
          onPress: ()=> supprimerDepense(id)
        }
      ]
    )
  }

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
        console.error('Erreur au chargement :', erreur);
      } finally {
        setEstPret(true);
      }
    };
    preparerApplication();
  }, []);

  useFocusEffect(useCallback(()=>{
    chargerDepenses();
  }, []));

  if (!estPret) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Initialisation de la base de données...</Text>
      </View>
    );
  }

  return (
    <FlatList 
      ListHeaderComponent={()=>(
        <View style={styles.header}>
          <Text style={styles.title}>Total des depenses de ce mois</Text>
          <Text style={styles.price}>{total} Ar</Text>
        </View>
      )}
      data={depenses} keyExtractor={(item)=> item.id!.toString()}
      renderItem={({item})=>(
        <HistoryCard  item={item} onDelete={confirmerSuppression} />
      )}
      ListEmptyComponent={()=> (
        <View style={styles.emptyComponent}>
          <Text style={styles.label}>Aucune dépense enregistrée</Text>
          <Button 
            title='Ajouter une dépense'
            onPress={()=>router.push('/depense')} 
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 8
  },
  title: {
      fontSize: 16,
      fontWeight: "700",
      color: "#1A202C",
      marginBottom: 5
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
    marginLeft: "auto"
  },
  centre: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
      flexDirection: "row"
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