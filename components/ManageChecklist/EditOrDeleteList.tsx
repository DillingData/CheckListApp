import React from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, Pressable, Button, TextInput, Alert, Keyboard } from "react-native";
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import GlobalHeader from "../GlobalHeader";
import { Ionicons } from '@expo/vector-icons';

//Class to hold the chosen checklist
class CheckList {
    public ID: number | undefined;
    public TASK: string | undefined;
    public SEQUENCE: number = 0;
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

    //Deletes a task from the checklist
    const DeleteRow = (ID:number | undefined) => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');
        
        db.execSync('DELETE FROM ' + tableName + ' WHERE ID = ' + ID);

        loadData();
    }

    //Prompt to make sure the user wants to delete the checklist
    const DeleteChecklist = () => {
        const table_without = tableName.replaceAll('_', ' ')
        
        Alert.alert(
            'Delete confirmation',
            'Do you want to delete ' + table_without + ' checklist - WARNING this CANNOT be reverted',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Ok', onPress: () => DeleteConfirmed()},
            ],

        );
    }

    //Deletes the entire checklist from the database
    const DeleteConfirmed = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');

        db.execSync('DROP TABLE ' + tableName);

        navigation.goBack();
    }

    //Saves any change made in the checklist
    const SaveCheckList = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');
        
        for (let counter = 0; counter < chosenChecklist.length; counter++) {
            db.execSync('UPDATE ' + tableName + ' SET TASK = \'' + chosenChecklist[counter].TASK + '\' WHERE ID = ' + chosenChecklist[counter].ID)
        }
        
        Keyboard.dismiss();
        loadData();
    }

    //Loads the data to be shown on the page
    const loadData = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');

        const tempHolding:CheckList[] = db.getAllSync('SELECT * FROM ' + tableName) as CheckList[];
        setChecklist(tempHolding);

        tempHolding.sort((a, b) => {
            if (a.SEQUENCE < b.SEQUENCE) {
                return -1;
            }
            if (a.SEQUENCE > b.SEQUENCE) {
                return 1;
            }
            return 0;
        })

        setIsLoading(false);
    }

    const AddNewTask = () => {

        const db = SQLite.openDatabaseSync('AllCheckLists.db');

        const count = chosenChecklist.length;

        db.execSync('INSERT INTO ' + tableName + ' (TASK, SEQUENCE) VALUES (\' \', ' + count +')');

        loadData();

        /*
        const newTask: CheckList = new CheckList;

        newTask.ID = undefined;
        newTask.SEQUENCE = 0;
        newTask.TASK = '';



        setChecklist(oldArray => [...oldArray, newTask]);
        */
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
                
                {chosenChecklist.map((CheckList, index) =>(
                    <View key={index} style={styles.AddedTasks}>
                        <TextInput 
                            style={styles.Text} 
                            editable
                            value={CheckList.TASK}
                            onChangeText={text => UpdateState(text, CheckList.ID)}/>
                        <Pressable style={styles.DeleteButton}>
                            <Ionicons 
                                name="arrow-down-outline"
                                size={20}
                                color="#336DDD"/>
                        </Pressable>
                        <Pressable>
                            <Ionicons 
                                name="arrow-up-outline"
                                size={20}
                                color="#336DDD"/>
                        </Pressable>
                        <Pressable style={styles.DeleteButton} onPress={() => DeleteRow(CheckList.ID)}>
                            <Ionicons 
                                name="close-circle"
                                size={30}
                                color="#336DDD"
                            />
                        </Pressable>
                    </View>
                ))}
                <View>
                    <Button 
                        title="Add new task"
                        onPress={() => {AddNewTask()}}/>
                </View>
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
        alignItems: 'center',
    },
    Text: {
        color: '#336DDD',
        fontSize: 18,
        marginBottom: 8,
        marginTop: 8,
        marginLeft: 15, 
        width: '75%',
    },
    DeleteButton: {
        //marginTop: 5, 
    },
    ButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
})

export default EditOrDeleteList;