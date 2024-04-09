import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import GlobalHeader from "../GlobalHeader";
 
type Table = {
    tableName: string;
}


{/* 
const EditOrDeleteList = (props: Table) => {
*/}
const EditOrDeleteList = () => {
    return (
        <View>
            {/* 
            <GlobalHeader text="Edit or Delete a checklist" />
            */}
            <Text>Test without props:</Text>
        </View>
    )
}

export default EditOrDeleteList;