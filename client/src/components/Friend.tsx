
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import statusColor from '../helper/statusColor'
import React from 'react'
import { Status } from '../interfaces/types/Status'

export default function Friend({friendName, friendStatus, friendPhoto, onPress}: {friendName: string, friendStatus: Status, friendPhoto?: string, onPress?: () => void}) {
    return (
        <Pressable style={styles.friendContainer} onPress={onPress}>
            <Image source={{uri: `http://10.0.2.2:4000/files/${friendPhoto}`}} style={[styles.friendPhoto, {borderColor: statusColor(friendStatus)}]} />
            <Text style={styles.friendName}>{friendName}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({

    friendContainer: {
        backgroundColor: '#fff',
        padding: 8,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 20
    },
    friendPhoto: {
        borderRadius: 99,
        width: 30,
        height: 30,
        borderWidth: 1.5
    },
    friendName: {
        fontSize: 16,
        fontWeight: "500"
    }

})