import React from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Pressable } from "react-native";
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import GlobalHeader from "../GlobalHeader";
import { Ionicons } from '@expo/vector-icons';

class CheckList {
    public ID: number | undefined;
    public TASK: string | undefined;
}

function Test(ID:number | undefined) {
    alert('Row with ID: ' + ID + ' were deleted');
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
                    setIsLoading(false);
                },
                (_, error): boolean | any => {
                    setIsLoading(false);
                }
            )
        })
    }

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused])

    if (isLoading == true) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        )
    } else {
        return (
            <View>
                <GlobalHeader text={"Edit list: " + JSON.stringify(Table)} />
                <Text>Table name you clicked: {JSON.stringify(Table)}</Text>
                {chosenChecklist.map((CheckList) =>(
                    <View key={CheckList.ID} style={styles.AddedTasks}>
                        <Text style={styles.Text}>{CheckList.TASK}</Text>
                        <Pressable style={styles.DeleteButton} onPress={() => Test(CheckList.ID)}>
                                    <Ionicons 
                                        name="close-circle"
                                        size={30}
                                        color="#336DDD"
                                    />
                                </Pressable>
                    </View>
                ))}
                <TouchableOpacity onPress={() => {navigation.goBack()}}>
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    AddedTasks: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        height: 40,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        marginTop: 10,
        textAlign: 'center',
    },
    Text: {
        color: '#336DDD',
        fontSize: 18,
        marginBottom: 8,
        marginTop: 8,
        marginLeft: 15, 
        width: '82%',
    },
    DeleteButton: {
        marginTop: 5,   
    }
})

export default EditOrDeleteList;