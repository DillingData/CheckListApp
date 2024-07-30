import React from "react";
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MainPage from "./MainPage/MainPage";
import NewCheckList from "./NewCheckList/NewCheckList";

const MaterialTab = createMaterialTopTabNavigator();

// TopNavigator for the checklist
function MyTab() {
    return (
        <SafeAreaView style={{ flex:1 }}>
            <MaterialTab.Navigator
                screenOptions={{
                    tabBarStyle: { backgroundColor: '#336DDD' }, // Set your desired background color here
                    tabBarLabelStyle: { color: 'white' }, // Set the text color to white
                }}>
                <MaterialTab.Screen 
                    name="Active CheckLists" 
                    component={MainPage} />
                <MaterialTab.Screen name="Start Checklist" component={NewCheckList} />
            </MaterialTab.Navigator>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#336DDD',
    }
})

export default MyTab;