import React, { useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import Checkbox from 'expo-checkbox';
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { useIsFocused } from "@react-navigation/native";

class ChosenChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
}

class ActivatedChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
    public COMPLETED: boolean | undefined;
}

class TableNameClass {
    public name: string | undefined;
}



const Activate = ({route, navigation}:any) => {
    const isFocused = useIsFocused();
    const [active, setActive] = useState<ActivatedChecklist[]>([]);
    const [chosen, setChosen] = useState<ChosenChecklist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dbAll = SQLite.openDatabase("AllCheckLists.db");
    const dbActive = SQLite.openDatabase("ActiveCheckLists.db");
    //const dbActive = SQLite.openDatabase("AllCheckLists.db");
    const type = 'table';
    const { Table } = route.params;

    //Checks if the checklist to activate has already been activated
    const CheckIfExists = () => {
        let TempArray: TableNameClass[] = [];
        //const { Table } = route.params;
        let incomingTable: string | undefined = JSON.stringify(Table).replace(/ /g, '_').replaceAll('"', '');
        const dbActive = SQLite.openDatabase('ActiveCheckLists.db');

        dbActive.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'', [], 
                    (_, {rows: {_array} }) => {
                        TempArray = _array;

                        let checkBool = 'false';

                        for (let counter = 0; counter < TempArray.length; counter++) {
                            if (TempArray[counter].name === incomingTable) {
                                checkBool = 'true';
                                break;
                            }
                        }

                        if (checkBool === 'true') {
                            Alert.alert('Error', 'This checklist has already been started - You need to finish the one you started or delete it to add it again', [
                                {
                                    text: 'Go Back',
                                    onPress: () => navigation.goBack(),
                                },
                            ]);
                        } else {
                            activateChecklist(Table);
                        }
                    }
                )
            }
            catch (error) {
                console.log(error);
            } 
        })
    }

    const activateChecklist = (Table: any) => {    
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');
        let tableName2: string | undefined = JSON.stringify(Table);

        dbAll.transaction(query => {
            try {
                query.executeSql('SELECT * FROM ' + tableName + '', [],
                    (_, {rows: { _array } }) => {
                        //setChosen(oldArray => [..._array]);
                        setChosen(oldArray => {
                            dbActive.transaction(innerQuery => {
                                try {
                                    innerQuery.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TASK TEXT, COMPLETED INT)');
                                }
                                catch (error) {
                                    console.log(error);
                                }
                    
                                for (let counter = 0; counter < _array.length; counter++) {
                                    try {
                                        innerQuery.executeSql('INSERT INTO ' + tableName + ' (TASK, COMPLETED) VALUES (\'' + _array[counter].TASK + '\', 0)') 
                                    } catch(error) {
                                        console.log(error)
                                    }
                                }
                            })
                            return[..._array]
                        })
                        loadActivatedChecklist();
                    },
                    (_, error): boolean | any => {
                        console.log(error);
                    }
                )
            }
            catch (error) {
                console.log(error);
            }
        })    
    }

    const TerminateChecklist = (tableName:string) => {
        tableName = JSON.stringify(tableName).replace(/ /g, '_');

        Alert.alert('Terminate checklist', 'Are you sure you want to terminate this checklist - this CANNOT be reverted', [
            {
                text: 'No',
            },
            {
                text: 'Yes',
                onPress: () => {
                    dbActive.transaction(query => {
                        try {
                            query.executeSql('DROP TABLE ' + tableName);
            
                            Alert.alert('Checklist terminated', 'The checklist has been terminated and you can now start it again', [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.goBack(),
                                },

                            ]);
                        }
                        catch (error) {
                            console.log(error);
                        } 
                    })
                },

            },
        ])
    }

    const updateCompleted = (ID: number | undefined, completed: boolean | undefined) => {
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');

        dbActive.transaction(query => {
            try {
                let completedToDB: number = 0;
                if (completed === false) {
                    completedToDB = 1;
                } else {
                    completedToDB = 0;
                }
                query.executeSql('UPDATE ' + tableName + ' SET COMPLETED = ' + completedToDB + ' WHERE ID = ' + ID)
            }
            catch(error) {
                console.log(error);
            }
        })

        //Alert.alert('ID: ' + ID + ' updated as completed or not completed')

        loadActivatedChecklist();
    }

    const loadActivatedChecklist = () => {
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');

        dbActive.transaction(query => {
            try {
                query.executeSql('SELECT * FROM ' + tableName + '', [],
                    (_, {rows: { _array } }) => {
                        setActive(oldArray => {
                            setIsLoading(false);
                            for (let counter = 0; counter < _array.length; counter++){
                                if (_array[counter].COMPLETED === 0) {
                                    _array[counter].COMPLETED = false;
                                } else {
                                    _array[counter].COMPLETED = true;
                                }
                            }
                            return [..._array];
                        });
                    }, 
                    (_, error): boolean | any => {
                        console.log(error);
                    }
                )
            }
            catch (error) {
                console.log(error);
            }
        })
    }

    useEffect(() => {
        if (isFocused) {
            const { Test } = route.params;
            if (Test === 'new') {
                CheckIfExists();
            } else {
                loadActivatedChecklist();
            }
        }
    }, [isFocused])

    if (isLoading == true) {
        return(
            <View>
                <GlobalHeader text="Activate Checklist" />
                <Text>Loading...</Text>
            </View>
        )
    }
    else {
        return (
            <View>
                <GlobalHeader text="Activate Checklist" />

                <ScrollView>
                    {active.map((active) => (
                        <View key={active.ID} style={ActivateStyles.AddedTasks}>
                            <Text style={ActivateStyles.Text}>{active.TASK}</Text>
                            <Checkbox
                                value={active.COMPLETED}
                                onValueChange={(newValue) => updateCompleted(active.ID, active.COMPLETED)}
                                color={active.COMPLETED ? '#4630EB' : undefined}    />
                            
                        </View>
                    ))}
                </ScrollView>
                <View style={ActivateStyles.ButtonRow}>
                    <Button 
                        title="Remove Checklist"
                        onPress={() => {TerminateChecklist(Table)}}
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

const ActivateStyles = StyleSheet.create({
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
    },
    ButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
}) 

export default Activate;