
import { View, Text, StyleSheet, Pressable } from 'react-native'
import Icon from "@expo/vector-icons/Ionicons"
import React from 'react'

export default function MenuOptions({text, iconName, nav, screenNav, onPress, notify, isNotify}: {text: string, iconName: any, notify?: number, isNotify?: boolean,nav?: any, screenNav?: string, onPress?: () => void}) {

    // Funcao para navegar entre os elementos
    function navigateBetweenScreens() {
        nav.navigate(screenNav)
    }

    if(isNotify) {
        return (
            <Pressable style={styles.menuOptionsContainer} onPress={onPress ? onPress : navigateBetweenScreens}>  
                <Icon name={iconName} size={25} />
                <Text style={styles.menuOptionsTitle}>{text}</Text>
                <View style={styles.menuOptionsNotify}><Text style={{color: "white", margin: 0, padding: 0}}>{notify}</Text></View>
            </Pressable> 
        )
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
    },
    menuOptionsNotify: {
        display: 'flex',
        backgroundColor: "#e63946",
        borderRadius: 99,
        padding: 6,
        marginLeft: "auto",
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center"
    }
})