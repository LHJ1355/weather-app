import React from "react";
import {StyleSheet, Text, View, TouchableWithoutFeedback} from "react-native";

export default function Loading(){
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Weather-App</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : "black",
        justifyContent : "flex-end",
        paddingHorizontal : 20,
        paddingVertical : 100,
    },
    text : {
        color : "white",
        fontSize : 30
    }
})