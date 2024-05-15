import React from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Pressable, Button, TextInput, Alert, Keyboard } from "react-native";
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import GlobalHeader from "../GlobalHeader";
import { Ionicons } from '@expo/vector-icons';

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

    const UpdateState = (text: string | any, id: number | any) => {
        for (let counter = 0; counter < chosenChecklist.length; counter++){
            if (chosenChecklist[counter].ID == id){
                chosenChecklist[counter].TASK = text;
            }
            setChecklist(oldArray => [...chosenChecklist]);
        }
    }

    const DeleteRow = (ID:number | undefined) => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');
        
        db.execSync('DELETE FROM ' + tableName + ' WHERE ID = ' + ID);

        loadData();
    }

    const DeleteChecklist = () => {
        const table_without = tableName.replaceAll('_', ' ')
        
        Alert.alert(
            'Delete confirmation',
            'Do you want to delete ' + table_without + ' checklist',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Ok', onPress: () => DeleteConfirmed()},
            ],

        );
    }

    const DeleteConfirmed = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');

        db.execSync('DROP TABLE ' + tableName);

        navigation.goBack();
    }

    const SaveCheckList = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');
        
        for (let counter = 0; counter < chosenChecklist.length; counter++) {
            db.execSync('UPDATE ' + tableName + ' SET TASK = \'' + chosenChecklist[counter].TASK + '\' WHERE ID = ' + chosenChecklist[counter].ID)
        }
        
        Keyboard.dismiss();
        loadData();
    }

    const loadData = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');

        const tempHolding:CheckList[] = db.getAllSync('SELECT * FROM ' + tableName) as CheckList[];
        setChecklist(tempHolding);

        setIsLoading(false);
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
                        onPress={() => {SaveCheckList()}}
                    />
                    <Button 
                        title="Delete checklist"
                        onPress={() => {DeleteChecklist()}}
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