import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";

class TableNameClass {
    public name: string | undefined;
}

const MainPage = () => {
    const [active, setActive] = useState<TableNameClass[]>([]);
    const [all, setAll] = useState<TableNameClass[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const dbActive = SQLite.openDatabase('ActiveCheckLists.db');
    const dbAll = SQLite.openDatabase('AllCheckLists.db');
    const isFocused = useIsFocused();
    const type = 'table';
    let TempArray: TableNameClass[] = [];

    const loadData = () => {
        dbActive.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'', [],
                (_, { rows: { _array } }) => {
                    TempArray = _array;
                    for (let counter:number = 0; counter < TempArray.length; counter++) {
                        TempArray[counter].name = TempArray[counter].name?.replaceAll('_', ' ');
                    }
                    setActive(TempArray);
                    console.log('Test')
                },
                (_, error): boolean | any => {
                    console.log(error + 'Where i get the tables');
                }
            );
            } catch (error) {
                console.log(error);
            }
        })

        dbAll.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'', [],
                (_, { rows: { _array } }) => {
                    TempArray = _array;
                    for (let counter:number = 0; counter < TempArray.length; counter++) {
                        TempArray[counter].name = TempArray[counter].name?.replaceAll('_', ' ');
                    }
                    setAll(TempArray);
                    console.log('Test')
                },
                (_, error): boolean | any => {
                    console.log(error + 'Where i get the tables');
                }
            );
            } catch (error) {
                console.log(error);
            }
        })

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
}

const mainPageStyles = StyleSheet.create({
    Header: {
        height: '40%',
        width: '100%',
    },
    HeaderText: {
        flex: 1,
        fontSize: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 65,
        marginLeft: '39%',
        color:'#FFFFFF',
    },
    ActiveCheckList: {
        marginTop: 40,
        width: '90%',
        alignContent: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        height: '35%',
    },
})

export default MainPage;