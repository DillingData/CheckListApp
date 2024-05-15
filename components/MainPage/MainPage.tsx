import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import * as SQLite from 'expo-sqlite';
import { useIsFocused } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Activate from "../ActivateChecklist/ActivateList";

class TableNameClass {
    public name: string = '';
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
    const dbActive = SQLite.openDatabaseSync('ActiveCheckLists.db');
    const dbAll = SQLite.openDatabaseSync('AllCheckLists.db');
    const isFocused = useIsFocused();
    const type = 'table';

    const loadData = () => {

        //dbActive.execSync('DROP TABLE Start_nyt_projekt');
        
        const tempArrayActive:TableNameClass[] = dbActive.getAllSync('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'') as TableNameClass[];
        console.log(tempArrayActive + ' - From Load Active');

        for (let counter:number = 0; counter < tempArrayActive.length; counter++) {
            tempArrayActive[counter].name = tempArrayActive[counter].name?.replaceAll('_', ' ');
        }

        setActive(tempArrayActive);

        const tempArrayAll = dbAll.getAllSync('SELECT name FROM sqlite_master WHERE type=\'' + type + '\' AND name <> \'sqlite_sequence\'') as TableNameClass[];

        for (let counter:number = 0; counter < tempArrayAll.length; counter++) {
            tempArrayAll[counter].name = tempArrayAll[counter].name?.replaceAll('_', ' ');
        }

        setAll(tempArrayAll);

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
                    <Text style={mainPageStyles.HeaderText2}>Active Checklists</Text>
                    <Text style={mainPageStyles.ChecklistText}>There are no active checklist. To start a new checklist press on a checklist from below list</Text>
                </View>

                <View style={mainPageStyles.Element}>
                    <Text style={mainPageStyles.HeaderText2}>All Checklists</Text>
                    <Text style={mainPageStyles.ChecklistText}>There are no checklists available to start, to add a checklist please use the "New List" from below menu</Text>
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
                        <Text style={mainPageStyles.ChecklistText}>There are no active checklist. To start a new checklist press on a checklist from below list</Text>
                    </View>
                </View>

                <View style={mainPageStyles.Element}>
                    <View>
                        <Text style={mainPageStyles.HeaderText2}>All Checklists</Text>
                    </View>
                    <ScrollView>
                        {all.map((name) => (
                            <View key={name.name} style={mainPageStyles.Row}>
                                <TouchableOpacity onPress={() => {navigation.navigate('Edit', { Table: name.name, Test: 'new' })}}>
                                    <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        )
    } else if (active.length != 0 && all.length == 0) {
        return(
            <View>
                <View>
                    <GlobalHeader text="Welcome" />
                </View>
                <View style={mainPageStyles.Element}>
                    <View>
                        <Text style={mainPageStyles.HeaderText2}>Active Checklists</Text>
                    </View>
                    <ScrollView>
                        {active.map((name) => (
                            <View key={name.name} style={mainPageStyles.Row}>
                                <TouchableOpacity onPress={() => {navigation.navigate('Edit')}}>
                                    <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <View style={mainPageStyles.Element}>
                    <Text style={mainPageStyles.HeaderText2}>All Checklists</Text>
                    <Text style={mainPageStyles.ChecklistText}>There are no checklists available to start, to add a checklist please use the "New List" from below menu</Text>
                </View>
            </View>
        )
    } else if (active.length != 0 && all.length != 0) {
        return(
            <View>
                <View>
                    <GlobalHeader text="Welcome" />
                </View>
                <View style={mainPageStyles.Element}>
                    <View>
                        <Text style={mainPageStyles.HeaderText2}>Active Checklists</Text>
                    </View>
                    <ScrollView>
                        {active.map((name) => (
                            <View key={name.name} style={mainPageStyles.Row}>
                                <TouchableOpacity onPress={() => {navigation.navigate('Edit',  { Table: name.name })}}>
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
                                <TouchableOpacity onPress={() => {navigation.navigate('Edit', { Table: name.name, Test: 'new' })}}>
                                    <Text style={mainPageStyles.ActiveText}>{name.name}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>
                </View>
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
    HeaderText2: {
        fontSize: 22,
        color: '#336DDD',
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 7,
        marginTop: 7,
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
        height: 300,
        width: '100%',
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