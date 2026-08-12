import StatHeader from "@/components/stats/header";
import { Stack } from "expo-router";

export default function Layout(){
    const header = () =>{
        return (
            <StatHeader />
        )
    }
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{title: "Statistique", header: header}}
            />
            <Stack.Screen
                name="notification"
                options={{title: "Notification"}}
            />
        </Stack>
    )
}