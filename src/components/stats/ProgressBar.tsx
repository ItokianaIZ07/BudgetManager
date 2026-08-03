import {View, StyleSheet} from "react-native"

interface ProgressBarProps{
    progress: number
    color?: string
}

export default function ProgressBar({progress, color}: ProgressBarProps){
    return (
        <View style={styles.container}>
            <View
                style={[styles.bar, {width:`${progress*100}%`, backgroundColor:color !== undefined ? color: "#1f6a98"}]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        height: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 4
    },
    bar: {
        height: "100%",
        borderRadius: 4
    }
})