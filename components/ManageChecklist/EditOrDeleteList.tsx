import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import GlobalHeader from "../GlobalHeader";

const EditOrDeleteList = ({route, navigation}:any) => {
    
    const { Table } = route.params;

    return (
        <View>
            {/* 
            <GlobalHeader text="Edit or Delete a checklist" />
            */}
            <Text>Table name you clicked: {JSON.stringify(Table)}</Text>
        </View>
    )
}

export default EditOrDeleteList;