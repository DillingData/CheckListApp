import React from "react";
import { Text, View, StyleSheet, Touchable, TouchableOpacity } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Activate from "../ActivateChecklist/ActivateList";
import MainPageStack from "./StackNavigation";

class TableNameClass {
    public name: string | undefined;
}

class ActiveChecklist {
    public id: number | undefined;
    public task: string | undefined;
    public finished: number | undefined;
}

type Checklist = {
    WhichDB: string;
    Headline: string;
}

{/* 
const Stack = createNativeStackNavigator();

function mainPageStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="HomeActive"
                component={ShowActiveCheckLists}
                options={{header: () => null}} />
            <Stack.Screen 
                name="Active"
                component={Activate}
                options={{header: () => null}} />
        </Stack.Navigator>
    )
}
*/}
const type = 'table';

//const ShowActiveCheckLists = (props: Checklist) => {
const ShowActiveCheckLists = ({TableNameClass}:any) => {

    const [isLoading, setIsLoading] = useState(true);
    const [names, setNames] = useState<TableNameClass[]>([]);
    const [activeChecklist, setActive] = useState<ActiveChecklist[]>([]);
    const isFocused = useIsFocused();

    /*
    const db = SQLite.openDatabase('ActiveCheckLists.db');
    //const db = SQLite.openDatabase(dbVersion);
    let TempArray: TableNameClass[] = [];

    const loadData = () => {
        db.transaction(query => {
            query.executeSql('DROP TABLE Test_Without_Spaces');
            query.executeSql('DROP TABLE Test_2_Without');
            query.executeSql('DROP TABLE Test_med_mellemrum');
            query.executeSql('DROP TABLE Geninstaller Computer');
        })
        console.log('deleted?')

        db.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'', [],
                (_, { rows: { _array } }) => {
                    TempArray = _array;
                    for (let counter:number = 0; counter < TempArray.length; counter++) {
                        TempArray[counter].name = TempArray[counter].name?.replaceAll('_', ' ');
                    }
                    setNames(TempArray);
                    console.log('Test')
                    setIsLoading(false);
                    console.log(names.length);
                },
                (_, error): boolean | any => {
                    console.log(error + 'Where i get the tables'),
                    setIsLoading(false);
                }
            );
            } catch (error) {
                console.log(error);
            }
        })
    }
    */
     
    useEffect(() => {
        if (isFocused) {
            //loadData();
        }
    }, [isFocused])
    {/*
    if (isLoading == true) {
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        ) 
    } else if (names.length == 0) {
        return (
            <View>
                <Text style={style.HeaderText}>Active Checklists</Text>
                <Text>No active Checklists</Text>
            </View>
        )
    } else {
        return (
            <View>
                <View>
                    <Text style={style.HeaderText}>Active Checklists</Text>
                </View>
                {names.map((name) => (
                    <View key={name.name} style={style.Row}>
                        <TouchableOpacity onPress={() => {navigation.navigate('Activate', { Table: name.name })}}>
                            <Text style={style.ActiveText}>{name.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        )
    }
    */}
}

const style = StyleSheet.create({
    HeaderText: {
        fontSize: 22,
        color: '#336DDD',
        fontWeight: '800',
        textAlign: 'center',
    },

    ActiveText: {
        color: '#336DDD',
        fontSize: 18,
        marginBottom: 8,
        marginTop: 8,
        marginLeft: 10, 
    },

    Row: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginTop: 10,
    }
})

//export default MainPageStack;
export default ShowActiveCheckLists;