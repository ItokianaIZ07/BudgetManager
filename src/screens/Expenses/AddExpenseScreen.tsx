import { useEffect, useState } from "react";
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform 
} from "react-native";
import { DepenseRepository } from "@/app/repositories/DepenseRepository";
import { CategorieRepository } from "@/app/repositories/CategorieRepository";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import { Depense } from "@/models/Depense";
import Header from "@/components/header";

export default function AddExpenseScreen() {
    const [montant, setMontant] = useState<string>('');
    const [description, setDescription] = useState<string>("");
    const [categorieId, setCategorieId] = useState<number>(1);
    const [modePaiement, setModePaiement] = useState<string>("Espèce");
    const regex = /^\d+$/

    function isValid(): boolean {
        try{
            return regex.test(montant);
        }catch(error){
            return false;
        }
    }

    function isDescriptionNull(){
        return description.trim() === "";
    }

    function resetChamp(): void{
        setMontant("");
        setDescription("");
        setCategorieId(1);
        setModePaiement("Espèce");
    }

    const handleAjoute = async () => {
        if (!isValid()) {
            console.log(montant);
            Alert.alert("Veuillez remplir le montant en nombre positif");
            return;
        }

        if(isDescriptionNull()){
            Alert.alert("Veuillez ajouter une description");
            return;
        }

        const depense: Depense = {
            montant: parseFloat(montant),
            description: description,
            categorie_id: categorieId,
            mode_paiement: modePaiement,
            date: new Date().toISOString().split('T')[0]
        };

        await DepenseRepository.ajouter(depense);
        Alert.alert("Votre dépense a bien été sauvegarder");
        resetChamp();
    };

    const modesPaiement = ["Espèce", "Carte", "Virement"];
    const categories = CategorieRepository.recupererTous();

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Header/>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                
                <View style={styles.header}>
                    <Text style={styles.title}>Nouvelle Dépense</Text>
                    <Text style={styles.subtitle}>Saisissez les détails de votre transaction</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Montant</Text>
                    <View style={styles.amountInputContainer}>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            placeholderTextColor="#A0AEC0"
                            keyboardType="numeric"
                            value={montant}
                            onChangeText={setMontant}
                        />
                        <Text style={styles.currencySymbol}>AR</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Achats supermarché..."
                        placeholderTextColor="#A0AEC0"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Catégorie</Text>
                    <View style={styles.pillsContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.pill,
                                    categorieId === cat.id && styles.pillActive
                                ]}
                                onPress={() => setCategorieId(cat.id!)}
                            >
                                <Text style={[
                                    styles.pillText,
                                    categorieId === cat.id && styles.pillTextActive
                                ]}>
                                    {cat.libelle}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Mode de paiement</Text>
                    <View style={styles.pillsContainer}>
                        {modesPaiement.map((mode) => (
                            <TouchableOpacity
                                key={mode}
                                style={[
                                    styles.pill,
                                    modePaiement === mode && styles.pillActive
                                ]}
                                onPress={() => setModePaiement(mode)}
                            >
                                <Text style={[
                                    styles.pillText,
                                    modePaiement === mode && styles.pillTextActive
                                ]}>
                                    {mode}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleAjoute} activeOpacity={0.8}>
                    <Text style={styles.submitButtonText}>Ajouter la dépense</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
    },
    scrollContainer: {
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: "700",
        color: "#1A202C",
    },
    subtitle: {
        fontSize: 14,
        color: "#718096",
        marginTop: 4,
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
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#A0AEC0",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 8,
    },
    amountInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    amountInput: {
        fontSize: 32,
        fontWeight: "700",
        color: "#2D3748",
        flex: 1,
    },
    currencySymbol: {
        fontSize: 24,
        fontWeight: "600",
        color: "#718096",
        marginLeft: 8,
    },
    input: {
        fontSize: 16,
        color: "#2D3748",
        paddingVertical: 4,
    },
    pillsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginTop: 4,
    },
    pill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#EDF2F7",
    },
    pillActive: {
        backgroundColor: "#3182CE",
    },
    pillText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#4A5568",
    },
    pillTextActive: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
    submitButton: {
        backgroundColor: "#3182CE",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        marginTop: 12,
        shadowColor: "#3182CE",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});