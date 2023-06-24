
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Alert, FlatList } from 'react-native'
import axios from "axios"
import React, { useEffect, useState, useRef } from 'react'
import socket from '../../helper/socketConn';
import Icon from "@expo/vector-icons/FontAwesome"
import ChatMessage from '../../components/ChatMessage';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../../constants';

export default function ChatRoom({ route, navigation }) {

    const [data, setData] = useState<any>();
    const [chatRoom, setChatRoom] = useState();
    const [messageData, setMessageData] = useState<any>();
    const [message, setMessage] = useState<string>()
    
    useEffect(() => {

        // Joinning Room
        const encapsulating = async () => {
            // Funcao para puxar os dados do usuario
            const {data:d} = await axios.get(API_URL + `/visiting/user/${route.params.email}`, {headers: {Authorization: await SecureStore.getItemAsync("jwt_token")}})

            if(d.error) {
                // Error handling
                Alert.alert("Falha", "Houve um erro desconhecido, tente novamente!", [{text: "Ok"}]);
                return navigation.navigate("Chat")
            }else {
                setData(d);
            }

            // Entrar em uma sala de conversas via o ID do Chat
            socket.emit("chat:joinning-room", {
                senderToken: await SecureStore.getItemAsync("jwt_token"),
                receiverId: route.params.id
            }, (res) => {
                setChatRoom(res.chatRoomId);
                setMessageData(res.chatData)
            })

        }
        encapsulating();

        socket.on("chat:updating-message", (data) => {setMessageData(data)})
    }, [socket])

    async function sendingMessage() {

        if(message.length == 0) {
            return;
        }

        socket.emit("chat:sending-message", {
            chatRoomId: chatRoom,
            content: message,
            sender: await SecureStore.getItemAsync("jwt_token")
        })

        setMessage("")
    }

    if(!data || !messageData) return;
    {/* Carregamento de mensagens */}
    
    return (
        <View style={styles.chatContainer}>
            <View style={styles.chatHeader}>
                <Image source={{uri: `http://10.0.2.2:4000/files/${data.profilePic}`}} style={styles.chatHeaderImage}/>
                <Text style={styles.chatHeaderUsername}>{data.nome}</Text>
            </View>

            {/* <ScrollView style={[styles.chatMessageView]} ref={scrollView}>
                
                {messageData?.mensagens.map(item => {
                    // Verifica quem enviou a mensagem para trocar de cor
                    if(item.sender == route.params.id) {
                        return (
                            <View key={item.createdAt} style={{marginBottom: 15}}>
                                <ChatMessage sender={false} text={item.content} />
                            </View>
                        )
                    } 

                    return (
                        <View key={item.createdAt} style={{marginBottom: 15}}>
                            <ChatMessage sender={true} text={item.content} />
                        </View>
                    )

                })}
            </ScrollView> */}
            
            <FlatList 
                data={messageData.mensagens}
                style={[styles.chatMessageView]}
                renderItem={({item}) => (
                    <View style={{marginBottom: 15}}>
                        <ChatMessage sender={item.sender == route.params.id ? true : false} text={item.content} />
                    </View>
                )}
                keyExtractor={item => item.createdAt}
                inverted contentContainerStyle={{ flexDirection: 'column-reverse' }}
            />
                
            <View style={styles.chatView}>
                <TextInput style={styles.chatMessageInput} placeholder='Digite sua mensagem' multiline value={message} onChangeText={(t) => setMessage(t)}/>
                <Icon name='arrow-right' size={25} style={styles.sendingMessageButton} color={"#fff"} onPress={sendingMessage}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    chatContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },
    chatHeader: {
        backgroundColor: "#3454D1",
        width: "100%",
        padding: 10,
        overflow: 'hidden',
        flexWrap: "nowrap",
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    chatHeaderImage: {
        borderRadius: 99,
        height: 50,
        width: 50,
        resizeMode: "contain"
    },
    chatHeaderUsername: {
        fontSize: 20,
        color: "#fff"
    },
    chatView: {
        backgroundColor: "#EFFAFD",
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chatMessageView: {
        width: "100%",
        padding: 0,
        marginBottom: 5
    },
    chatMessageInput: {
        backgroundColor: "#fff",
        width: "75%",
        padding: 5,
        paddingHorizontal: 8,
        borderRadius: 30
    },
    sendingMessageButton: {
        backgroundColor: "#069786",
        padding: 8,
        borderRadius: 30
    }
})