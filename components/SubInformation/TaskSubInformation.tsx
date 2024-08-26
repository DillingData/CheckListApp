import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";


const taskSubInformation = () => {
    return (
        <View>
            <Text style={styles.header}>TaskSubInformation</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    header: {
        backgroundColor: '#336DDD',
    }
})


export default taskSubInformation;