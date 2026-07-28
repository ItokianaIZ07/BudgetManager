import { Depense } from "@/models/Depense";
import { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface HeaderProps{
    depenses : Depense[]
}

export default function HistoryHeader({depenses}: HeaderProps){
    const [total, setTotal] = useState<number>(0);

    const calculateTotal = ()=>{
        setTotal(depenses.length);
    }

    useMemo(()=>{
        calculateTotal();
    }, [depenses]);

    return (
        <View style={styles.header}>
            <Text style={styles.title}>Total des dépenses effectuées</Text>
            <Text style={styles.number}>{total}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#eeeeee",
        marginTop: 8,
        padding: 8,
        borderRadius: 8,
        height: 72,
        alignItems: "center"
    },
    title: {
        fontSize: 16,
        fontWeight: "bold"
    },
    number: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#16689e",
        borderRadius: 50,
        width: 48,
        height: 48,
        textAlign: "center"
    }
});