import React from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Pressable, Button, TextInput } from "react-native";
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import GlobalHeader from "../GlobalHeader";
import { Ionicons } from '@expo/vector-icons';

class CheckList {
    public ID: number | undefined;
    public TASK: string | undefined;
}

function DeleteRow(ID:number | undefined) {
    alert('Row with ID: ' + ID + ' were deleted');
}

const EditOrDeleteList = ({route, navigation}:any) => {
    const { Table } = route.params;
    const [isLoading, setIsLoading] = useState(true);
    const [chosenChecklist, setChecklist] = useState<CheckList[]>([]);
    const tableName: string = JSON.stringify(Table).replace(/ /g, '_');
    const isFocused = useIsFocused();

    const UpdateState = (text: string | any, id: number | any) => {
        for (let counter = 0; counter < chosenChecklist.length; counter++){
            if (chosenChecklist[counter].ID == id){
                chosenChecklist[counter].TASK = text;
            }
            setChecklist(oldArray => [...chosenChecklist]);
        }
    }

    const loadData = () => {
        const db = SQLite.openDatabase('AllCheckLists.db');
        db.transaction(query => {
            query.executeSql('SELECT * FROM ' + tableName + '', [],
                (_, { rows: { _array } }) => {
                    setChecklist(_array);
                    setIsLoading(false);
                },
                (_, error): boolean | any => {
                    console.log(error);
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
                <GlobalHeader text="Loading..." />
                <Text>Loading...</Text>
            </View>
        )
    } else {
        return (
            <View>
                <GlobalHeader text={"Edit list: " + JSON.stringify(Table)} />
                
                {chosenChecklist.map((CheckList) =>(
                    <View key={CheckList.ID} style={styles.AddedTasks}>
                        <TextInput 
                            style={styles.Text} 
                            editable
                            value={CheckList.TASK}
                            onChangeText={text => UpdateState(text, CheckList.ID)}/>
                        <Pressable style={styles.DeleteButton} onPress={() => DeleteRow(CheckList.ID)}>
                            <Ionicons 
                                name="close-circle"
                                size={30}
                                color="#336DDD"
                            />
                        </Pressable>
                    </View>
                ))}
                <View style={styles.ButtonRow}>
                    <Button 
                        title="Save"
                    />
                    <Button 
                        title="Delete checklist"
                    />
                    <Button 
                        title="Back"
                        onPress={() => {navigation.goBack()}}
                    />
                </View>
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
    },
    ButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
})

export default EditOrDeleteList;