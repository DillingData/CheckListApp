import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, Pressable } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState } from "react";
import GlobalHeader from "../GlobalHeader";
import { getDefaultLibFileName } from "typescript";

const activate = () => {
    return (
        <View>
            <Text>Activate Checklist</Text>
        </View>
    )
}

export default activate;