import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { getDefaultLibFileName } from "typescript";

class ChosenChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
}

class ActivatedChecklist {
    public ID: number | undefined;
    public TASK: string | undefined;
    public COMPLETED: boolean | undefined;
}

function CheckIfExists(incomingTable: string | undefined) {
    const dbActive = SQLite.openDatabase('ActiveCheckLists.db');
    const [active, setActive] = useState<ActivatedChecklist[]>([]);

    dbActive.transaction(query => {
        try {
            query.executeSql('SELECT * FROM ' + incomingTable + '', [], 
                (_, {rows: {_array} }) => {
                    setActive(_array);
                }
            )
        }
        catch (error) {
            console.log(error);
        } 
    })

    if (active.length == 0) {
        return true;
    } else {
        return false;
    }
}

const Activate = ({route, navigation}:any) => {
    let tableName: string | undefined;
    let tableName2: string | undefined;
    const [active, setActive] = useState<ActivatedChecklist[]>([]);
    const [chosen, setChosen] = useState<ChosenChecklist[]>([]);

    const check = CheckIfExists(tableName);

    if (check === true) {
        Alert.alert('Checklist already started');
        //Add button to navigation to go back
        //navigation.goBack();
    }

    const dbAll = SQLite.openDatabase("AllCheckLists.db");
    const dbActive = SQLite.openDatabase("ActiveCheckLists.db");

    /*
    if (route.params != undefined) {
        const { Table } = route.params;
        tableName = JSON.stringify(Table).replace(/ /g, '_');
        tableName2 = JSON.stringify(Table);      

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
    }
    */

    console.log('tablName:' + tableName);
    console.log('tableName2: ' + tableName2);

    return (
        <View>
            <GlobalHeader text="Activate Checklist" />
            <Text>Activate Checklist</Text>
            <Text>{tableName}</Text>
            <Text>{tableName2}</Text>
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

export default Activate;