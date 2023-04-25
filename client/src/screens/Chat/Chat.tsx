
import { View, Text, StyleSheet, TextInput, Image } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React from 'react'
import Icon from "@expo/vector-icons/Ionicons"

export default function Chat({navigation}) {
    return (
        <View style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.chatHeader}>
                <TextInput placeholder='Digite seu contato' style={styles.chatHeaderInput} />
                <Icon name='menu' size={35} onPress={() => navigation.navigate("Menu")} color={"#fff"} />
                {/* Icon */}
            </View>
            {/* Messages */}
            <View>
                <View style={styles.chatMessageContainer}>
                    <Image source={require("../../assets/adaptive-icon.png")} style={styles.imageProfile} />
                    <View>
                        <Text>Geovane Fiirst</Text>
                    </View>
                </View>
            </View>
            <StatusBar hidden={true} />
        </View>
    )
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    chatHeader: {
        backgroundColor: "#3454D1",
        padding: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    chatHeaderInput: {
        backgroundColor:  "#fff",
        color: "#000",
        marginRight: 60,
        marginLeft: 10,
        width: "70%",
        borderRadius: 30,
        padding: 8,
        fontSize: 12,
        height: 30
    },
    chatMessageContainer: {
        width: "100%",
        backgroundColor: "#EFFAFD",
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    imageProfile: {
        width: 40,
        height: 40,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: "#000"
    }
})