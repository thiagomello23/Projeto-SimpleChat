
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React from 'react'

export default function ChatFriend({friendName, friendPhoto, onPress}) {
    return (
        <Pressable style={styles.chatMessageContainer} onPress={onPress}>
            <Image source={{
                uri: `http://10.0.2.2:4000/files/${friendPhoto}`
            }} style={styles.imageProfile} />
            <View>
                <Text>{friendName}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
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