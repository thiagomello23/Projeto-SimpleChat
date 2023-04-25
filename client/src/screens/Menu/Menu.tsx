
import { View, Text, Modal, StyleSheet, Pressable, TextInput, Alert, Keyboard } from 'react-native'
import React, {useState} from 'react'
import MenuOptions from '../../components/MenuOptions'
import Button from '../../components/Button';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../../../constants';
import Friend from '../../components/Friend';

export default function Menu({navigation}) {

    const [modalStatus, setModalStatus] = useState({
        logout: false,
        addFriends: false,
        blackList: false
    });

    const [email, setEmail] = useState<string>();

    async function logoutHandler() {
        // Apagar o token
        await SecureStore.deleteItemAsync("jwt_token")
        // Redirecionar para o login
        navigation.navigate("Login");
    }

    async function searchContact() {
        Keyboard.dismiss();

        // Faz uma requisicao passando o email do usuario
        const { data: d } = await axios.post(API_URL + "/menu/add", 
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
        } else {
            // Fecha a modal
            setModalStatus((prev) => {
                return {...prev, addFriends: false}
            })
            // Alert message
            Alert.alert("Contato adicionado", d.msg)
        }

    }

    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <MenuOptions text={"Perfil"} iconName={"person"} nav={navigation} screenNav={"Profile"} />
            <MenuOptions text={"Adicionar Contato"} iconName={"add-circle"} onPress={() => {setModalStatus((prev) => {return {...prev, addFriends: true}})}}/>
            <MenuOptions text={"Visualizar conversas"} iconName={"chatbubble"} nav={navigation} screenNav={"Profile"} />
            <MenuOptions text={"Notificacoes"} iconName={"notifications"} nav={navigation} screenNav={"Profile"} />
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
                        <Button text='Adicionar' onpress={searchContact}/>
                    </View>
                </View>
            </Modal>

            {/* BlackList */}

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