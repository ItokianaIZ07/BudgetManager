import { useFocusEffect } from "expo-router";
import { useState } from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image} from "react-native";
import { Util } from "@/app/utils/util";
import { CategorieRepository } from "@/app/repositories/CategorieRepository";

interface SortProps {
    onSort : (id: number)=>void,
    onInput: (keyword: string)=>void
}

export default function SortComponent({onSort, onInput}: SortProps){
    const [filtre, setFiltre] = useState<number>(-1);
    const [options, setOptions] = useState<any[]>([]);
    
    useFocusEffect(()=>{
        setFiltre(-1);
        const opt = [
            {id: -1, libelle: "Toutes"},
            ...CategorieRepository.recupererTous()
        ]
        setOptions(opt);
    });

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
                    onChangeText={(value)=>{
                        onInput(value),
                        setFiltre(-1)
                    }}
                />
            </View>
            <ScrollView horizontal={true} contentContainerStyle={styles.scrollContainer} showsHorizontalScrollIndicator={true}>
                {options.map((item)=>(
                    <View key={item.id} style={[
                            styles.option,
                            item.id === filtre && styles.focus
                        ]}
                    >
                        <TouchableOpacity
                            onPress={()=>{
                                onSort(item.id!),
                                setFiltre(item.id!)
                            }}
                        >
                            <Text
                                style={item.id === filtre ? styles.focusLabel: styles.optionDefaultLabel}
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
    container:{
        padding: 8
    },
    option:{
        borderRadius:40,
        backgroundColor: "#e6e6e7",
        padding: 8,
        margin: 8
    },
    optionDefaultLabel: {
        color: "#333"
    },
    focus:{
        backgroundColor: "#3182CE",
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
        // margin: 8,
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
    scrollContainer: {
        // padding: 4,
    },
});