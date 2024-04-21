import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { getDefaultLibFileName } from "typescript";

class ChosenChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
}

class ActivatedChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
    public COMPLETED: boolean | undefined;
}

const Activate = ({route, navigation}:any) => {
    let tableName: string | undefined;
    let tableName2: string | undefined;
    const [active, setActive] = useState<ActivatedChecklist[]>([]);
    const [chosen, setChosen] = useState<ChosenChecklist[]>([]);
    const dbAll = SQLite.openDatabase("AllCheckLists.db");
    const dbActive = SQLite.openDatabase("ActiveCheckLists.db");

    if (route.params != undefined) {
        const { Table } = route.params;
        tableName = JSON.stringify(Table).replace(/ /g, '_');
        tableName2 = JSON.stringify(Table);        
    }

    console.log('tablName:' + tableName);
    console.log('tableName2: ' + tableName2);

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