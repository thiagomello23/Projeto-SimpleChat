
import { View, Text, StyleSheet, TextInput, Image, ScrollView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, Fragment } from 'react'
import Icon from "@expo/vector-icons/Ionicons"
import ChatFriend from '../../components/ChatFriend';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../../constants';
import { AmigoInterface } from '../../interfaces/ProfileDataInterface';
import { useIsFocused } from '@react-navigation/native';

export default function Chat({navigation}) {    

    // State
    const [data, setData] = useState<AmigoInterface>();
    const [search, setSearch] = useState<any>(); // Por cada letra ir pesquisando

    const isFocused = useIsFocused();

    useEffect(() => {

        // Puxa os dados dos usuarios adicionados
        async function encapsulating() {

            const { data: d } = await axios.get(API_URL + "/profile/friends", {
                headers:  {
                    Authorization: await SecureStore.getItemAsync("jwt_token")
                }
            })

            if(d.error) {
                // Envia para a aba de login
                navigation.navigate("Login")
            } else {
                setData(d);
            }

        }

        encapsulating();
    }, [isFocused])

    function searchFriend(t: string) {
        const filteredFriends = data.amigos.filter(amigo => {
            if(amigo.nome.startsWith(t)) {
                return amigo;
            }
        })
        setSearch(filteredFriends)
    }

    if(!data) return;

    return (
        <ScrollView style={styles.chatContainer}>
            {/* Header */}
            <View style={styles.chatHeader}>
                <TextInput placeholder='Digite seu contato' style={styles.chatHeaderInput} onChangeText={(t) => searchFriend(t)} />
                <Icon name='menu' size={35} onPress={() => navigation.navigate("Menu")} color={"#fff"} />
                {/* Icon */}
            </View>
            {/* Messages */}
            <View>
                {search ? (
                    <>
                        {search.map(amigo => (
                            <Fragment key={amigo.email}>
                                <ChatFriend friendName={amigo.nome} friendPhoto={amigo.profilePic} onPress={() => navigation.navigate("ChatRoom", {id: amigo._id, email: amigo.email})}/>
                            </Fragment>

                        ))}
                    </>
                ) : (
                    <>
                        {data.amigos.map(amigo => (
                            <Fragment key={amigo.email}>
                                <ChatFriend friendName={amigo.nome} friendPhoto={amigo.profilePic} onPress={() => navigation.navigate("ChatRoom", {id: amigo._id, email: amigo.email})}/>
                            </Fragment>

                        ))}
                    </>
                )}
                {/* Mensagem de amigos adicionados */}
                {data.amigos.length == 0 && (
                    <Text style={{padding: 30, fontWeight: "bold", fontSize: 18}}>Nenhum amigo adicionado!</Text>
                )}
            </View>
            <StatusBar hidden={true} />
        </ScrollView>
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
    }
})