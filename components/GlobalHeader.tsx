import { View, Text, StyleSheet, Platform } from "react-native"

type HeaderText = {
    text: string; 
}

const GlobalHeader = (props: HeaderText) => {
    return(
        <View style={headerStyling.Header}>
            <Text style={headerStyling.HeaderText}>{props.text}</Text>
        </View>
    )
}

const headerStyling = StyleSheet.create({
    Header: {
        height: 120,
        width: '100%',
        backgroundColor: '#336DDD',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    }, 
    HeaderText: {
        fontSize: 22,
        flex:1,
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        textAlign: 'center',
        color:'#FFFFFF',
    }
})

export default GlobalHeader;