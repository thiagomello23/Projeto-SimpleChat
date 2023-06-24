
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

// Se for eu a cor vai ser uma, se for outro a cor vai ser outra
export default function ChatMessage({text, sender}) {

    const color = sender ? "#ABEBFD" : "#EFFAFD";

    return (
        <View style={[styles.container, {backgroundColor: color}]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: "100%",
        backgroundColor: "#fff",
        padding: 12,
    },
    text: {
        fontSize: 14,
        fontWeight: "500"
    }
})