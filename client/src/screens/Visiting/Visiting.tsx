
import { View, Text, StyleSheet, Image } from 'react-native'
import React, {useState, useEffect} from 'react'
import Button from '../../components/Button'
import { ProfileInterface } from '../../interfaces/ProfileDataInterface';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../../../constants';

export default function Visiting({ route, navigation }) {
    // Vai carregar imagem, nome do perfil, status, bio (API Request)
    // Vai pegar os dados do usuario via "navigation" do react-navigator
    // Vai ter as funcionalidades de "Conversar" e "Bloquear"

    // States
    const [data, setData] = useState<ProfileInterface>();

    useEffect(() => {
        
        async function encapsulating() {

            // Pegar o token do usuario
            const token = await SecureStore.getItemAsync("jwt_token")

            // Pega o email do usuario da pagina
            // Se o email nao existir entao redireciona
            const {email} = route.params;

            // Fazer uma requisicao procurando dados de outro usuario
            const { data: d } = await axios.get(API_URL + `/visiting/user/${email}`, {
                headers: {
                    "Authorization": token
                }
            })
            // Validar a requisicao
            if(d.error) {
                // Error handling e redirecionamento de usuario
            } else {
                // Pegar os dados
                setData(d);
                // Carregar os dados na aplicacao
            }

        }

        encapsulating();

    }, [])

    if(!data) return;

    return (
        <View style={styles.container}>
            <View style={styles.containerWrapper}>
                {/* Profile Info */}
                <View style={styles.profileImageContainer}>
                    <Image source={{
                        uri: data.profilePic ? `http://10.0.2.2:4000/files/${data.profilePic}` : require("../../assets/adaptive-icon.png")
                    }} style={[styles.visitingPic, {borderColor: "#069786"}]}/>
                    <Text style={styles.visitingName}>{data.nome}</Text>
                </View>
                {/* Buttons */}
                <View style={styles.visitingButtonContainer}>
                    <View style={{width: "48%"}}><Button text='Conversar' color='#069786'/></View>
                    <View style={{width: "48%"}}><Button text='Bloquear' color='#D1345B'/></View>
                </View>
                {/* Bio */}
                <View>
                    <Text style={styles.bioTitle}>Bio</Text>
                    <View style={styles.bioTextBox}>
                        <Text style={styles.bioText}>{data.bio}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    visitingImage: {

    },
    visitingButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 30
    },
    bioTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    bioTextBox: {
        backgroundColor: "#EFFAFD",
        padding: 20,
        marginTop: 5,
        height: 180,
        overflow: "hidden"
    },
    bioText: {
        fontSize: 16,
        fontWeight: "500",
        lineHeight: 20
    },
    profileImageContainer: {
        alignItems: "center",
        marginTop: 50,
        width: "100%",
        position: "relative"
    },
    visitingPic: {
        height: 180,
        width: 180,
        borderRadius: 99,
        borderWidth: 2,
        borderColor: "#000",
    },
    // Limitar um tamanho para o nome de perfil
    visitingName: {
        fontSize: 24,
        color: "#000",
        fontWeight: "500",
        marginTop: 20
    },
    containerWrapper: {
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto"
    },
})