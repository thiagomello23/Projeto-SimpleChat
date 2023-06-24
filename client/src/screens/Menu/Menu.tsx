
import { View, Text, Modal, StyleSheet, Pressable, TextInput, Alert, Keyboard } from 'react-native'
import React, {useEffect, useState} from 'react'
import MenuOptions from '../../components/MenuOptions'
import Button from '../../components/Button';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../../../constants';
import Friend from '../../components/Friend';
import { useIsFocused } from '@react-navigation/native';

export default function Menu({navigation}) {

    const [countNotify, setCountNotify] = useState(null);
    const [email, setEmail] = useState<string>();

    const [modalStatus, setModalStatus] = useState({
        logout: false,
        addFriends: false,
        blackList: false
    });

    const isFocused = useIsFocused();

    useEffect(() => {

        async function encapsulating() {
            // Fazer protecao caso o token seja invalido
            const t = await SecureStore.getItemAsync("jwt_token");

            const {data: d} = await axios.get(API_URL + "/menu/notify/count", {
                headers: {
                    "authorization": t
                }
            })

            if(d.error) {
                return navigation.navigate("Login");
            } else {
                setCountNotify(d.number)
            }

        }

        encapsulating();
    }, [isFocused])

    async function logoutHandler() {
        // Apagar o token
        await SecureStore.deleteItemAsync("jwt_token")
        // Redirecionar para o login
        navigation.navigate("Register");
    }

    async function addContact() {
        Keyboard.dismiss();

        // Faz uma requisicao passando o email do usuario
        const { data: d } = await axios.post(API_URL + "/menu/notify", 
        {
            email: email
        },
        {
            headers: {
                Authorization: await SecureStore.getItemAsync("jwt_token")
            }
        })

        console.log(d);

        if(d.error) {
            // Error handler
            return Alert.alert("Falha", "Não foi possível adicionar o contato, por favor tente novamente!", [{text: "Ok"}]);
        } else {
            // Fecha a modal
            setModalStatus((prev) => {
                return {...prev, addFriends: false}
            })
            // Alert message
            return Alert.alert("Notificação Enviada", "Pedido de amizade enviado com sucesso!")
        }

    }

    if(!setCountNotify) return;

    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <MenuOptions text={"Perfil"} iconName={"person"} nav={navigation} screenNav={"Profile"} />
            <MenuOptions text={"Adicionar Contato"} iconName={"add-circle"} onPress={() => {setModalStatus((prev) => {return {...prev, addFriends: true}})}}/>
            <MenuOptions text={"Visualizar conversas"} iconName={"chatbubble"} nav={navigation} screenNav={"Chat"} />
            <MenuOptions text={"Notificações"} iconName={"notifications"} nav={navigation} screenNav={"Notification"} notify={countNotify} isNotify={countNotify > 0 ? true: false} />
            {/* Abrir uma modal */}
            <MenuOptions text={"Deslogar"} iconName={"log-out"} onPress={() => {setModalStatus((prev) => {return {...prev, logout: true}})}}/>

            {/* Logout Modal */}
            <Modal visible={modalStatus.logout} animationType='fade' transparent={true}>
                <Pressable style={styles.overlay} onPress={() => setModalStatus((prev) => {return {...prev, logout: false}})} />
                <View style={styles.wrapper}>
                    <View style={styles.logoutContainer}>
                        <Text style={styles.logoutTitle}>Tem certeza que deseja se deslogar?</Text>
                        <View style={{flexDirection: "row", gap: 10}}>
                            <View style={{width: "45%"}}><Button text='Nao' color='#D1345B' onpress={() => setModalStatus((prev) => {return {...prev, logout: false}})}/></View>
                            <View style={{width: "45%"}}><Button text='Sim' color='#069786'  onpress={logoutHandler}/></View>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Contacts */}
            <Modal visible={modalStatus.addFriends} animationType='fade' transparent={true}>
                <Pressable style={styles.overlay} onPress={() => setModalStatus((prev) => {return {...prev, addFriends: false}})} />
                <View style={styles.wrapper}>
                    <View>
                        <TextInput style={styles.addContactsInput} placeholder='Digite o email do contato' onChangeText={(t) => setEmail(t)} />
                        <Button text='Adicionar' onpress={addContact}/>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.7,
        backgroundColor: "#fff"
    },
    wrapper: {
        top: '50%',
        left: '50%',
        width: "70%",
        transform: [{translateX: -140}, {translateY: -60}],
        backgroundColor: "#3454D1",
    },
    logoutContainer: {
        padding: 15,

    },
    logoutTitle: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 12 
    },
    addContactsContainer: {
        padding: 8
    },
    addContactsInput: {
        borderRadius: 30,
        backgroundColor: "#fff",
        color: "#000",
        margin: 10,
        paddingHorizontal: 8
    },
    searchView: {
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        marginVertical: 20,
    }
})