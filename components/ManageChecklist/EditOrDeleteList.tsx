import React from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import GlobalHeader from "../GlobalHeader";

class CheckList {
    public ID: number | undefined;
    public TASK: string | undefined;
}

const EditOrDeleteList = ({route, navigation}:any) => {
    const { Table } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [chosenChecklist, setChecklist] = useState<CheckList[]>([]);
    const tableName: string = JSON.stringify(Table).replace(/ /g, '_');
    const isFocused = useIsFocused();

    console.log(tableName);

    const loadData = () => {
        const db = SQLite.openDatabase('AllCheckLists.db');
        db.transaction(query => {
            query.executeSql('SELECT * FROM ' + tableName + '', [],
                (_, { rows: { _array } }) => {
                    setChecklist(_array);
                }
            )
        })
    }

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused])

    return (
        <View>
            <GlobalHeader text={"Edit list: " + JSON.stringify(Table)} />
            <Text>Table name you clicked: {JSON.stringify(Table)}</Text>
            {chosenChecklist.map((CheckList) =>(
                <View key={CheckList.ID}>
                    <Text>{CheckList.TASK}</Text>
                </View>
            ))}
            <TouchableOpacity onPress={() => {navigation.goBack()}}>
                <Text>Back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditOrDeleteList;