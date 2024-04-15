import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainPage from "./MainPage";
import Activate from "../ActivateChecklist/ActivateList";

const Stack = createNativeStackNavigator();

function MainPageStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={MainPage}
                options={{header: () => null}} />
            <Stack.Screen 
                name="Edit"
                component={Activate}
                options={{header: () => null}} />
        </Stack.Navigator>
    )
}