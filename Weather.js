import React from "react";
import {StyleSheet, View, Text, StatusBar} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import PropTypes from "prop-types";

const weatherOptions = {
    Clear : {
        iconName : "weather-sunny",
        gradient : ["#1c92d2", "#f2fcfe"],
    },
    Clouds : {
        iconName : "weather-cloudy",
        gradient : ["black", "white"],
    },
    Thunderstorm : {
        iconName : "weather-lightning",
        gradient : ["#0f0c29", "#302b63", "#24243e"],
    },
    Drizzle : {
        iconName : "weather-hail",
        gradient : ["#56CCF2", "white"],
    },
    Rain : {
        iconName : "weather-rainy",
        gradient : ["#667db6", "#0082c8", "#0082c8", "#667db6"],
    },
    Snow : {
        iconName : "weather-snowy",
        gradient : ["#56CCF2", "white"],
    },
}
export default function Weather({condition, temp}){
    console.log(condition, temp);
    return( 
    <LinearGradient colors={weatherOptions[condition].gradient} style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <View style={styles.halfContainer}>
            <MaterialCommunityIcons name={weatherOptions[condition].iconName} size={66} color="white" />
            <Text style={styles.temp}>{temp}℃</Text>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.title}>title</Text>
            <Text style={styles.subtitle}>subtitle</Text>
        </View>
    </LinearGradient>
    );
}

Weather.propTypes = {
    temp : PropTypes.number.isRequired,
    condition : PropTypes.oneOf([
        "Thunderstorm",
        "Drizzle",
        "Rain",
        "Snow",
        "Clear",
        "Clouds"
    ]).isRequired,
}

const styles = StyleSheet.create({
    container : {
        flex : 1,        
    },
    temp : {
        fontSize : 30,
        color : "white",
    },
    halfContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "center"
    },
    textContainer : {
        flex : 1,
        justifyContent : "center",
        alignItems : "flex-start",
        paddingHorizontal : 20
    },
    title : {
        fontSize : 30,
        fontWeight : "300",
        color : "white"
    },
    subtitle : {
        color : "white"
    }
})