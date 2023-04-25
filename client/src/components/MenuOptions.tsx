
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Icon from "@expo/vector-icons/Ionicons"
import React from 'react'

export default function MenuOptions({text, iconName, nav, screenNav, onPress}: {text: string, iconName: any, nav?: any, screenNav?: string, onPress?: () => void}) {

    // Funcao para navegar entre os elementos
    function navigateBetweenScreens() {
        nav.navigate(screenNav)
    }

    return (
        <Pressable style={styles.menuOptionsContainer} onPress={onPress ? onPress : navigateBetweenScreens}>  
            <Icon name={iconName} size={25} />
            <Text style={styles.menuOptionsTitle}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    menuOptionsContainer: {
        backgroundColor: "#EFFAFD",
        padding: 15,
        flexDirection: "row",
        alignItems: "center"
    },
    menuOptionsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 15
    }
})