import React, { useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
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
    const type = 'table';

    //Checks if the checklist to activate has already been activated
    const CheckIfExists = () => {
        let TempArray: TableNameClass[] = [];
        const { Table } = route.params;
        let incomingTable: string | undefined = JSON.stringify(Table).replace(/ /g, '_').replaceAll('"', '');
        const dbActive = SQLite.openDatabase('ActiveCheckLists.db');

        dbActive.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'', [], 
                    (_, {rows: {_array} }) => {
                        TempArray = _array;

                        let checkBool = 'false';

                        for (let counter = 0; counter < TempArray.length; counter++) {
                            console.log('TempArrayName: ' + TempArray[counter].name);
                            console.log('Value to check against: ' + incomingTable);

                            if (TempArray[counter].name === incomingTable) {
                                checkBool = 'true';
                                break;
                            }
                        }

                        if (checkBool === 'true') {
                            Alert.alert('Error', 'This checklist has already been started', [
                                {
                                    text: 'Go Back',
                                    onPress: () => navigation.goBack(),
                                },
                            ]);
                        } else {
                            activateChecklist();
                        }
                    }
                )
            }
            catch (error) {
                console.log(error);
            } 
        })
    }
    

    const activateChecklist = () => {   
        const { Table } = route.params;
        let tableName: string | undefined = JSON.stringify(Table).replace(/ /g, '_');
        let tableName2: string | undefined = JSON.stringify(Table);

        dbAll.transaction(query => {
            try {
                query.executeSql('SELECT * FROM ' + tableName + '', [],
                    (_, {rows: { _array } }) => {
                        setChosen(_array);

                    }
                ),
                (_: any, error: any) => {
                    console.log(error);
                }
            }
            catch (error) {
                console.log(error);
            }
        });

        console.log('Does it reach here?');
        /*
        dbActive.transaction(query => {
            try {
                query.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + '(ID INTEGER PRIMARY KEY AUTOINCREMENT, TASK TEXT, COMPLETED INT)');
            }
            catch (error) {
                console.log(error);
            }
            
            
            for (let counter = 0; counter < chosen.length; counter++) {
                try {
                    query.executeSql('INSERT INTO') 
                } catch(error) {
                    console.log(error)
                }
            }
        })
        */
        setIsLoading(false);
    }

    const loadActivatedChecklist = () => {

    }

    useEffect(() => {
        if (isFocused) {
            if (route.params != undefined) {
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
                <Text>Activate Checklist</Text>
                <Button 
                    title="Back"
                    onPress={() => {navigation.goBack()}}
                />
    
                {chosen.map((chosen) => (
                    <View key={chosen.ID}>
                        <Text>{chosen.TASK}</Text>
                    </View>
                ))}
            </View>
        )
    }
}

export default Activate;