import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { Ionicons } from '@expo/vector-icons';

const NewCheckList = () => {
    const [name, setName] = useState<string>();
    const [tasks, setTasks] = useState<string[]>([]);
    const [chosenTask, setTaskToAdd] = useState<string>();
    const [tables, setTables] = useState<string[]>([]);

    //Adds a new task to the new checklist
    const AddNewTask = (chosenTask: any) => {
        setTaskToAdd('');
        if (chosenTask == '' || chosenTask == null) {
            return; 
        }

        for (let counter = 0; counter < tasks.length; counter++) {
            if (tasks[counter] === chosenTask) {
                clearInputField();
                Alert.alert('You cannot add the same task more than once!');
                return;
            }
        }

        setTasks(oldArray => [...oldArray, chosenTask]);
        clearInputField();
    }

    //Clears the input field
    const clearInputField = () => {
        setTaskToAdd(oldTask => '');
    }

    //Clears the task list
    const clearTasks = () => {
        setTasks(oldArray => []);
    }

    //Clears the name field
    const clearNameField = () => {
        setName(oldName => '');
    }

    //Rmeoves a task from the new checklist
    const RemoveTask = (chosenTask: any) => {
        if (tasks.length === 1) {
            const newArray = tasks.splice(0, 1);
            setTasks(oldArray => [...tasks]);
        }
        let index = tasks.indexOf(chosenTask, 0);
        const newArray = tasks.splice(index, 1)
        setTasks(oldArray => [...tasks]);
    }

    //Saves the checklist to the database
    const SaveChecklist = (nameToAdd: any) => {
        if (name == '' || name == null) {
            Alert.alert('You must give the checklist a name');
        } else if (tasks.length === 0) {
            Alert.alert('You must add tasks to the checklist');
        }
        
        //Replaces spaces with _ as spaces cant be in the table name
        const parsedName = nameToAdd.replace(/ /g, '_');

        console.log(parsedName);

        const db = SQLite.openDatabaseSync('AllCheckLists.db');

        db.execSync('CREATE TABLE IF NOT EXISTS ' + parsedName + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TASK TEXT)');
        for (let counter = 0; counter < tasks.length; counter++) {
            try {
                db.execSync('INSERT INTO ' + parsedName + ' (TASK) VALUES (\'' + tasks[counter] + '\')');
            } catch (error) {
                console.log(error);
            }
        } 

        /*
        db.transaction(query => {
            try {
                query.executeSql('CREATE TABLE IF NOT EXISTS ' + parsedName + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TASK TEXT)');
            } catch (error) {
                console.log(error);
            }

            for (let counter = 0; counter < tasks.length; counter++) {
                try {
                    query.executeSql('INSERT INTO ' + parsedName + ' (TASK) VALUES (\'' + tasks[counter] + '\')');
                } catch (error) {
                    console.log(error);
                }
            } 
        })
        */

        Alert.alert('Checklist added');
        clearInputField();
        clearTasks();
        clearNameField();
    }

    //Use to delete tables from the SQLite database, it needs manual handling with database name, 
    //future improvement to make it look through database names and delete all in the list.
    const DeletAllChecklists = () => {
        const db = SQLite.openDatabaseSync('AllCheckLists.db');
        
        const tempHolding:string[] = db. getAllSync('SELECT name FROM sqlite_master WHERE type=\'table\' AND name <> \'sqlite_sequence\'') as string[];
        setTables(tempHolding);

        /*
        db.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'table\' AND name <> \'sqlite_sequence\'', [],
                (_, { rows: { _array } }) => {
                    setTables(_array);
                    console.log(tables);
                },
                (_, error): boolean | any => {
                    console.log(error + 'Where i get the tables')
                }
            );
            } catch (error) {
                console.log(error);
            }
        })
        */
        /*
        try {
            db.transaction(query => {
                query.executeSql('DROP TABLE IF EXISTS NewCheck')
            })
        } catch(error) {
            console.log(error);
        }
        */

        console.log(tables);
        
    }

    return(
        <View style={styles.Parent}>
            <View>
                <GlobalHeader text="Create New Checklist" />
            </View>
            <View>
                <Text style={styles.SubHeader}>Name of the new Checklist</Text>
                <TextInput 
                    editable
                    style={styles.TextInput}
                    onChangeText={text => setName(text)}
                    value={name}
                />
            </View>
            <View style={styles.Parent}>
                <Text style={styles.SubHeader}>Tasks</Text>
                <View style={styles.TaskRow}>
                    <TextInput 
                        editable
                        style={styles.TextInputRow}
                        value={chosenTask}
                        onChangeText={text => setTaskToAdd(text)}
                    />
                    <Button 
                        title='Add'
                        onPress={() => AddNewTask(chosenTask)}
                    />
                </View>
                <ScrollView>
                    {tasks.map((task) => (
                        <View key={task} style={styles.AddedTasks}>
                            <Text style={styles.Text}>{task}</Text>
                            <Pressable style={styles.DeleteButton} onPress={() => RemoveTask(task)}>
                                <Ionicons 
                                    name="close-circle"
                                    size={30}
                                    color="#336DDD"
                                />
                            </Pressable>
                        </View>
                    ))}
                    <View style={styles.SaveButton}>
                        <Button 
                            title="Save checklist"
                            onPress={() => SaveChecklist(name)}
                        /> 
                    </View>

                    {/* BELOW IS USED FOR DEBUG WHEN NEED TO DELETE TABLES */}
                    {/* 
                    <View style={styles.SaveButton}>
                        <Button 
                            title="<--DEBUG--> Delete All checklists <--DEBUG-->"
                            onPress={() => DeletAllChecklists()}
                        /> 
                    </View>
                    */}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create ({
    Parent: {
        flex: 1, 
    },
    SubHeader: {
        textAlign: 'center',
        fontWeight: '500',
        color: '#336DDD',
        fontSize: 19,
        marginBottom: 10,
        marginTop: 15,  
    },
    TextInput: {
        backgroundColor: '#FFFFFF',
        color: '#336DDD',
        borderRadius: 15,
        height: 40,
        width: '90%',
        marginLeft: '5%',
        marginRight: '5%',
        textAlign: 'center',
    },
    TextInputRow: {
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        color: '#336DDD',
        height: 40,
        width: '70%',
        marginLeft: '5%',
        marginRight: '5%',
        textAlign: 'center',
    },
    TaskRow: {
        flexDirection: 'row',
        marginBottom: 15,
    },
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
    SaveButton: {
        marginTop: 10, 
    },
    DeleteButton: {
        marginTop: 5,   
    }
})

export default NewCheckList;