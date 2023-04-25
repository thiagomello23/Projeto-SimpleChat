
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from "lottie-react-native"

export default function Loading() {
    return (
        <>
            <LottieView  source={require("../assets/loader.json")} autoPlay loop style={styles.loadingSize}/>
        </>
    )
}

const styles = StyleSheet.create({
    loadingSize: {
        height: 80,
        width: 80
    }
})