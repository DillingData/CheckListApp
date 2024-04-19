import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Activate from "../ActivateChecklist/ActivateList";

class TableNameClass {
    public name: string | undefined;
}

const Stack = createNativeStackNavigator();

function MyStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Main" 
                component={MainPage}
                options={{header: () => null}}
            />
            <Stack.Screen 
                name="Edit" 
                component={Activate}
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

const MainPage = ({navigation}:any) => {
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
    } else if (active.length == 0 && all.length == 0) {
        return (
            <View>
                <View>
                    <GlobalHeader text="Welcome" />
                </View>

                <View style={mainPageStyles.Element}>
                    <Text style={mainPageStyles.HeaderText}>Active Checklists</Text>
                    <Text>No active Checklists</Text>
                </View>

                <View style={mainPageStyles.Element}>
                    <Text style={mainPageStyles.HeaderText}>All Checklists</Text>
                    <Text>No Checklists</Text>
                </View>
            </View>
        )
    } else if (active.length == 0 && all.length != 0) {
        return (
            <View>
                <View>
                    <GlobalHeader text="Welcome" />
                </View>

                <View style={mainPageStyles.Element}>
                    <View>
                        <Text style={mainPageStyles.HeaderText2}>Active Checklists</Text>
                        <Text>No active Checklists</Text>
                    </View>
                </View>

                <View style={mainPageStyles.Element}>
                    <View>
                        <Text style={mainPageStyles.HeaderText2}>All Checklists</Text>
                    </View>
                    {all.map((name) => (
                        <View key={name.name} style={mainPageStyles.Row}>
                            <TouchableOpacity onPress={() => {navigation.navigate('Edit', { Table: name.name })}}>
                                <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        )
    } else if (active.length != 0 && all.length == 0) {
        <View>
            <View style={mainPageStyles.Element}>
                <View>
                    <Text style={mainPageStyles.HeaderText2}>Active Checklists</Text>
                </View>

                {active.map((name) => (
                    <View key={name.name} style={mainPageStyles.Row}>
                        <TouchableOpacity onPress={() => {navigation.navigate('Activate', { Table: name.name })}}>
                            <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={mainPageStyles.Element}>
                <Text style={mainPageStyles.HeaderText}>All Checklists</Text>
                <Text>No Checklists</Text>
            </View>
        </View>
    } else if (active.length != 0 && all.length != 0) {
        <View>
            <View style={mainPageStyles.Element}>
                <View>
                    <Text style={mainPageStyles.HeaderText2}>Active Checklists</Text>
                </View>
                <ScrollView>
                    {active.map((name) => (
                        <View key={name.name} style={mainPageStyles.Row}>
                            <TouchableOpacity onPress={() => {navigation.navigate('Activate', { Table: name.name })}}>
                                <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
            
            <View style={mainPageStyles.Element}>
                <View>
                    <Text style={mainPageStyles.HeaderText2}>All Checklists</Text>
                </View>
                <ScrollView>
                    {all.map((name) => (
                        <View key={name.name} style={mainPageStyles.Row}>
                            <TouchableOpacity onPress={() => {navigation.navigate('Edit', { Table: name.name })}}>
                                <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        </View>
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
    HeaderText2: {
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
    },
    Element: {
        height: 400,
    }
})

export default MyStack;