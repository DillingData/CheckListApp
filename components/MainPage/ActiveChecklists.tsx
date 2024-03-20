import React from "react";
import { Text, View, StyleSheet } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";

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

const type = 'table';

const ShowActiveCheckLists = (props: Checklist) => {

    const [isLoading, setIsLoading] = useState(true);
    const [names, setNames] = useState<TableNameClass[]>([]);
    const [activeChecklist, setActive] = useState<ActiveChecklist[]>([]);
    const isFocused = useIsFocused();

    const loadData = () => {
        
        let dbVersion = '';
        let headLine = '';

        if (props.WhichDB === 'active') {
            dbVersion = 'ActiveCheckLists.db';
            headLine = 'Active Checklists'
        } else if (props.WhichDB === 'all') {
            dbVersion = 'AllCheckLists.db';
            headLine = 'Checklists to start'
        } 

        //const db = SQLite.openDatabase('ActiveCheckLists.db');
        const db = SQLite.openDatabase(dbVersion);
        let TempArray: TableNameClass[] = [];

        db.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'', [],
                (_, { rows: { _array } }) => {
                    TempArray = _array;
                    for (let counter:number = 0; counter < TempArray.length; counter++) {
                        TempArray[counter].name = TempArray[counter].name?.replaceAll('_', ' ');
                    }
                    setNames(TempArray);
                    setIsLoading(false);
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
    } else if (names.length === 0) {
        return (
            <View>
                <Text style={style.HeaderText}>{props.Headline}</Text>
                <Text>No active Checklists</Text>
            </View>
        )
    } else {
        return (
            <View>
                <View>
                    <Text style={style.HeaderText}>{props.Headline}</Text>
                </View>
                {names.map((name) => (
                    <View key={name.name} style={style.Row}>
                        <Text style={style.ActiveText}>{name.name} </Text>
                    </View>
                ))}
            </View>
        )
    }
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

export default ShowActiveCheckLists;