import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { getDefaultLibFileName } from "typescript";

const Activate = ({route, navigation}:any) => {
    const { Table } = route.params;
    const tableName: string = JSON.stringify(Table).replace(/ /g, '_');
    const tableName2: string = JSON.stringify(Table);
    const dbAll = SQLite.openDatabase("AllCheckLists.db");
    const dbActive = SQLite.openDatabase("ActiveCheckLists.db");

    

    return (
        <View>
            <GlobalHeader text="Activate Checklist" />
            <Text>Activate Checklist</Text>
            <Text>{tableName}</Text>
            <Text>{tableName2}</Text>
            <Button 
                title="Back"
                onPress={() => {navigation.goBack()}}
            />
        </View>
    )
}

export default Activate;