import { useFocusEffect } from "expo-router";
import { useState } from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image} from "react-native";

interface SortProps {
    onSort : (id: number)=>void,
    onInput: (keyword: string)=>void
}

export default function SortComponent({onSort, onInput}: SortProps){
    const [filtre, setFiltre] = useState<number>(-1);
    const [keyWord, setKeyWord] = useState<string>("");
    const options = [
        {id: -1, label: "Toutes"},
        { id: 1, label: "Alimentation" },
        { id: 2, label: "Transport" },
        { id: 3, label: "Loisirs" },
        { id: 4, label: "Crédit" },
        { id: 5, label: "Autre"}
    ];

    useFocusEffect(()=>setFiltre(-1));

    return (
        // <ScrollView horizontal={true} style={styles.container}>
        // </ScrollView>
        <View>
            <View style={styles.filtreText}>
                <Image
                    source={require("@/assets/images/search.png")}
                    style={{ width: 24, height: 24 }}
                />
                <TextInput
                    style={styles.keyWordInput} 
                    placeholder="Rechercher une transaction..."
                    onChangeText={onInput}
                    onChange={()=>setFiltre(-1)}
                />
            </View>
            <View style={styles.container}>
                {options.map((item)=>(
                    <View key={item.id} style={item.id === filtre ? styles.focus: styles.option}>
                        <TouchableOpacity
                            onPress={()=>{
                                onSort(item.id),
                                setFiltre(item.id)
                            }}
                        >
                            <Text
                                style={item.id === filtre ? styles.focusLabel: styles.optionDefaultLable}
                            >
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        // justifyContent: "space-between",
        flexDirection: "row",
        // overflowX: "scroll",
    },
    option:{
        borderRadius:40,
        backgroundColor: "#e6e6e7",
        padding: 8,
        margin: 8
    },
    optionDefaultLable: {
        color: "#333"
    },
    focus:{
        backgroundColor: "#3182CE",
        borderRadius:40,
        padding: 8,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    focusLabel: {
        color: "white"
    },
    filtreText:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 8,
        height: 56,
        backgroundColor: "#e6e2e291",
        borderRadius: 8,
        margin: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    keyWordInput: {
        fontSize: 16,
        fontWeight: "700",
        color: "#2D3748",
        flex: 1,
    },
});