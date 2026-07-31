import { Stack } from "expo-router";

export default function Layout(){
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{title: "Paramètres"}}
            />
            <Stack.Screen
                name="category"
                options={{title: "Catégorie"}}
            />
        </Stack>
    )
}