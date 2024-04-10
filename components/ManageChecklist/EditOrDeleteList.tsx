import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

class CheckList {
    public id: number | undefined;
    public task: string | undefined;
}

const EditOrDeleteList = ({route, navigation}:any) => {
    const { Table } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [chosenChecklist, setChecklist] = useState<CheckList[]>([]);
    const tableName: string = JSON.stringify(Table);

    const loadData = () => {
        const db = SQLite.openDatabase('AllCheckLists.db');

        db.transaction(query => {
            query.executeSql('SELECT * FROM ' + tableName + '',)
        })
    }

    return (
        <View>
            <Text>Table name you clicked: {JSON.stringify(Table)}</Text>
        </View>
    )
}

export default EditOrDeleteList;