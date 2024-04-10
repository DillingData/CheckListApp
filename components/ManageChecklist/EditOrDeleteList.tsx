import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";

class CheckList {
    public id: number | undefined;
    public task: string | undefined;
}

const EditOrDeleteList = ({route, navigation}:any) => {
    
    const { Table } = route.params;

    return (
        <View>
            <Text>Table name you clicked: {JSON.stringify(Table)}</Text>
        </View>
    )
}

export default EditOrDeleteList;