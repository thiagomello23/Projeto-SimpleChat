
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusComponent } from '../interfaces/StatusComponentInterface'
import axios from 'axios';
import { API_URL } from '../../constants';
import * as SecureStore from 'expo-secure-store';
import statusColor from '../helper/statusColor';

export default function Status({status, closeModal, setData}: StatusComponent) {

    async function changeStatus() {
        // Pega o token
        const token = await SecureStore.getItemAsync("jwt_token");

        // Requisicao HTTP
        const { data } = await axios.post(API_URL + "/profile/status", {
            status: status
        }, {
            headers: {
                "Authorization": token
            }
        })

        // Verificacao da resposta
        if(data.error) {
            // Error Handling
        } else {
            // Definir novo status
            setData(prev => {
                return {...prev, status: status}
            })
        }

        // Fechar a modal
        closeModal(false);
    }

    return (
        <TouchableOpacity style={styles.statusContainer} onPress={changeStatus}>
            <View style={[styles.statusColor, {backgroundColor: statusColor(status)}]}></View>
            <Text style={styles.statusText}>{status}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    statusContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: "center"
    },
    statusColor: {
        height: 30,
        width: 30,
        borderRadius: 99,
    },
    statusText: {
        fontSize: 16,
        fontWeight: "500"
    }
})