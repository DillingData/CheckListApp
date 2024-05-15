import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import GlobalHeader from "../GlobalHeader";
import { useIsFocused } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditOrDeleteList from "./EditOrDeleteList";

class TableNameClass {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}
const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={EditCheckList}
                options={{header: () => null}}
            />
            <Stack.Screen 
                name="Edit" 
                component={EditOrDeleteList}
                options={{
                    header: () => null,
                    headerStyle: {
                        backgroundColor: '#336DDD'
                    },
                    headerTintColor: '#FFFFFF'
                }}
            />
        </Stack.Navigator>
    )
}

const EditCheckList = ({navigation}:any) => {
    const [isLoading, setIsLoading] = useState(true);
    const [names, setNames] = useState<TableNameClass[]>([]);
    const isFocused = useIsFocused();

    const loadData = () => {
        
        const db = SQLite.openDatabaseSync('AllCheckLists.db');
        let TempArray: TableNameClass[] = [];

        const tempHolding:TableNameClass[] = db.getAllSync('SELECT name FROM sqlite_master WHERE type=\'table\' AND name <> \'sqlite_sequence\'') as TableNameClass[];
        
        for (let counter:number = 0; counter < tempHolding.length; counter++) {
            tempHolding[counter].name = tempHolding[counter].name?.replaceAll('_', ' ');
        }

        setNames(tempHolding);

        setIsLoading(false);

        /*
        db.transaction(query => {
            try {
                query.executeSql('SELECT name FROM sqlite_master WHERE type=\'table\' AND name <> \'sqlite_sequence\'', [],
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
        */
    }

    /*
    <Text style={mainPageStyles.ChecklistText}>There are no checklists available to start, to add a checklist please use the "New List" from below menu</Text>
    */

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused])

    if (isLoading){
        return(
            <View>
                <View>
                    <GlobalHeader text="Manage Checklist" />
                </View>
                <View>
                    <Text>Edit Existing Checklist</Text>
                </View>
            </View>
        )
    } else if (names.length == 0) {
        return(
            <View>
                <View>
                    <GlobalHeader text="Manage Checklist" />
                </View>
                <View>
                    <Text style={style.ChecklistText}>There are no checklists available to edit, to add a checklist please use the "New List" from below menu</Text>
                </View>
            </View>
        )
    } else {
        return(
            <View>
                <View>
                    <GlobalHeader text="Manage Checklist" />
                </View>
                <View>
                    <Text style={style.SubHeader}>Choose checklist to edit</Text>
                </View>
                <ScrollView style={style.ScrollView}>
                    {names.map((name) => (
                        <View key={name.name} style={style.Row}>
                             
                            <TouchableOpacity onPress={() => {navigation.navigate('Edit', { Table: name.name })}}>
                                <Text style={style.ActiveText}>{name.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        )
    }
}

const style = StyleSheet.create({
    SubHeader: {
        color: '#336DDD',
        fontSize: 20,
        marginBottom: 15,
        marginTop: 15,
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
        marginLeft: '5%',
        marginRight: '5%',
        width: '90%',
    },
    ScrollView: {
        height: '100%',
    },
    ChecklistText: {
        textAlign: 'center',
        color: '#336DDD',
        fontWeight: '500',
        marginTop: '5%',
        marginLeft: '10%',
        marginRight: '10%', 
        fontSize: 17,
    }
})

export default MyStack;