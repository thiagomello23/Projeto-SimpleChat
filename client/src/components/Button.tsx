
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

export default function Button({text, onpress, color}: {text: string, onpress?: () => void, color?: string}) {
    return (
        <TouchableOpacity style={[styles.button, {backgroundColor: color ? color: "#34D1BF"}]} onPress={onpress}>
            <Text style={styles.buttonText}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 16
    }
})