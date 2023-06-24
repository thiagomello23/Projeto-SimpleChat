import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import React from 'react'
import Icon from "@expo/vector-icons/Ionicons"
import axios from 'axios'
import { API_URL } from '../../constants'
import * as SecureStore from 'expo-secure-store';

export default function FriendNotification({data, setUpdate}:{data: any, setUpdate: (arg: boolean) => void}) {

    async function addContact() {

        // Mandar uma requisicao pra API com os dados de sender e receiver (sender = ID do token)
        // receiver_id e via token
        const { data: d } = await axios.post(API_URL + "/menu/addContact", {
            sender_id: data.sender_id
        }, {
            headers: {
                Authorization: await SecureStore.getItemAsync("jwt_token")
            }
        })

        if(d.error) {
            return Alert.alert("Falha", "Houve um erro ao aceitar o convite, por favor tente novamente!");
        } else {
            Alert.alert("Adicionado", "Contato adicionado com sucesso!");
            return setUpdate(true);
        }

    }

    async function denyContact() {
        
        const { data: d } = await axios.post(API_URL + "/menu/denyContact", {
            sender_id: data.sender_id
        }, {
            headers: {
                Authorization: await SecureStore.getItemAsync("jwt_token")
            }
        })

        if(d.error) {
            return Alert.alert("Falha", "Falha ao processar a recusa do pedido de amizade");
        } else {
            Alert.alert("Excluido", "Contato negado com sucesso!");
            return setUpdate(true);
        }

    }

    return (
        <View style={styles.notifyContainer}>
            <Text>{data?.sender_email} quer ser seu amigo!</Text>
            
                <View style={styles.buttonsContainer}>
                    <Pressable onPress={addContact}>
                        <Icon name='checkmark-outline' color={"#70e000"} size={30} />
                    </Pressable>
                    <Pressable onPress={denyContact}>
                        <Icon name='close-outline' color={"#e63946"} size={30} />
                    </Pressable>
                </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    notifyContainer: {
        width: "100%",
        backgroundColor: "#EFFAFD",
        padding: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    buttonsContainer: {
        flexDirection: "row",
        gap: 10,
    }
})