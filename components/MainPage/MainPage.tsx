import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import ShowActiveCheckLists from "./ActiveChecklists";
import ShowAllCheckLists from "./AllChecklists";

import GlobalHeader from "../GlobalHeader";

const MainPage = () => {
    return (
        <View>
            <View>
                <GlobalHeader text="Welcome" />
            </View>
            <ScrollView style={mainPageStyles.ActiveCheckList}>
                <ShowActiveCheckLists />
            </ScrollView>
            
            <ScrollView style={mainPageStyles.ActiveCheckList}>
                <ShowAllCheckLists />
            </ScrollView>
            
        </View>
    )
}

const mainPageStyles = StyleSheet.create({
    Header: {
        height: '40%',
        width: '100%',
    },
    HeaderText: {
        flex: 1,
        fontSize: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 65,
        marginLeft: '39%',
        color:'#FFFFFF',
    },
    ActiveCheckList: {
        marginTop: 40,
        width: '90%',
        alignContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        height: '35%',
    },
})

export default MainPage;