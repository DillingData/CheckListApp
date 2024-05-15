import React, { useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert, ScrollView } from "react-native";
import Checkbox from 'expo-checkbox';
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { useIsFocused } from "@react-navigation/native";

class ChosenChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
}

class TempHoldingArray {
    public ID: number | undefined;
    public NAME: string | undefined;
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
    const dbAll = SQLite.openDatabaseSync("AllCheckLists.db");
    const dbActive = SQLite.openDatabaseSync("ActiveCheckLists.db");
    //const dbActive = SQLite.openDatabase("AllCheckLists.db");
    const type = 'table';
    const { Table } = route.params;

    //Checks if the checklist to activate has already been activated
    const CheckIfExists = () => {
        let TempArray: TableNameClass[] = [];
        //const { Table } = route.params;
        let incomingTable: string | undefined = JSON.stringify(Table).replace(/ /g, '_').replaceAll('"', '');
        const dbActive = SQLite.openDatabaseSync('ActiveCheckLists.db');

        TempArray = dbActive.getAllSync('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'') as TableNameClass[];

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

    const activateChecklist = (Table: any) => {    
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');
        console.log('activateChecklist');

        try {
            const tempArray: TempHoldingArray[] = dbAll.getAllSync('SELECT * FROM ' + tableName + '') as TempHoldingArray[];
            
            console.log(tempArray);

            for (let counter = 0; counter < tempArray.length; counter++) {
                console.log(tempArray[counter].ID)
            }
            
            dbActive.execSync('CREATE TABLE IF NOT EXISTS ' + tableName + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TASK TEXT, COMPLETED INT)');
            for (let counter = 0; counter < tempArray.length; counter++) {
                dbActive.execSync('INSERT INTO ' + tableName + ' (TASK, COMPLETED) VALUES (\'' + tempArray[counter].TASK + '\', 0)');
            }
        }
        catch (error) {
            console.log(error);
        }

        loadActivatedChecklist();
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

                    dbActive.execSync('DROP TABLE ' + tableName);
                    Alert.alert('Checklist terminated', 'The checklist has been terminated and you can now start it again', [
                        {
                            text: 'Ok',
                            onPress: () => navigation.goBack(),
                        },

                    ]);
                },
            },
        ])
    }

    const updateCompleted = (ID: number | undefined, completed: boolean | undefined) => {
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');

        try {
            let completedToDB: number = 0;
            if (completed === false) {
                completedToDB = 1;
            } else {
                completedToDB = 0;
            }
            dbActive.execSync('UPDATE ' + tableName + ' SET COMPLETED = ' + completedToDB + ' WHERE ID = ' + ID)
        }
        catch(error) {
            console.log(error);
        }

        loadActivatedChecklist();
    }

    const loadActivatedChecklist = () => {
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');

        type tempHolding = {
            ID: number | undefined;
            TASK: string | undefined;
            COMPLETED: boolean | number;
        }

        const tempArray:tempHolding[] = dbActive.getAllSync('SELECT * FROM ' + tableName + '') as tempHolding[]

        for (let counter = 0; counter < tempArray.length; counter++) {
            if (tempArray[counter].COMPLETED === 0) {
                tempArray[counter].COMPLETED = false;
            } else {
                tempArray[counter].COMPLETED = true;
            }
        }

        setActive(tempArray as ActivatedChecklist[]);

        setIsLoading(false);
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
                <View>
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
        alignItems: 'center',
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