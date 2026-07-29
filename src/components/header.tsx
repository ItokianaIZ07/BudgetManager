import { View, StyleSheet, Text, Image } from "react-native"

export default function Header(){
    return (
        <View style={styles.headerApp}>
        <Text style={styles.headerTitle}>Suivie de Budget</Text>
        <Image
          source={require("@/assets/images/tabIcons/currency-manat.png")}
          style= {styles.logo}
        />
      </View>
    )
}

const styles = StyleSheet.create({
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
});