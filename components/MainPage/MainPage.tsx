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
    }


    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused])

    return (
        <View>
            <View>
                <GlobalHeader text="Welcome" />
            </View>

            <ScrollView style={mainPageStyles.ActiveCheckList}>
                
            </ScrollView>
             {/*
            <ScrollView style={mainPageStyles.ActiveCheckList}>
                <ShowActiveCheckLists />
            </ScrollView>
            
            <ScrollView style={mainPageStyles.ActiveCheckList}>
                <ShowAllCheckLists />
            </ScrollView>
            */}
        </View>
    )
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