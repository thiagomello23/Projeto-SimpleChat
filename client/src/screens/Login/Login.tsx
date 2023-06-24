
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Button from '../../components/Button'
import globalStyle from '../../globalStyles'
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../../../constants';

export default function Login({navigation}) {

    // States
    const [email, setEmail] = useState<string>()
    const [senha, setSenha] = useState<string>()
    const [errorHandler, setErrorHandler] = useState<string>();
    const [validation, setValidation] = useState<boolean>();

    // Verifica se o usuario ja esta logado ou nao
    useEffect(() => {

        async function validationEncap() {
            const { data: d } = await axios.get(API_URL + "/auth/validator", {
                headers: {
                    Authorization: await SecureStore.getItemAsync("jwt_token")
                }
            })
            
            if(d.error) {
                setValidation(true)
            } else {
                navigation.navigate("Chat");
            }
            console.log("refresh")
        }
        validationEncap();
    }, [navigation])

    if(validation !== true) return;

    // Quando clicar fora fechar o teclado
    async function handlingForm() {
        // Fazer as verificacoes minimas
        if(!email) {
            setErrorHandler("Email invalido!")
            return;
        }

        if(!senha) {
            setErrorHandler("Senha invalida!")
            return;
        }

        // Enviar para a rota da API
        const { data } = await axios.post(`${API_URL}/auth/login`, {
            email: email,
            senha: senha
        })

        // Error Handling
        if (data.error) {
            setErrorHandler(data.msg)
        } else {
            // JWT
            SecureStore.setItemAsync("jwt_token", data.token)
                .then(() => {
                    // Redirecionar
                    navigation.navigate("Chat")
                })
        }

    }

    return (
        <KeyboardAvoidingView behavior={"height"} style={globalStyle.containerBlue}>

                <ScrollView>
                    <Text style={globalStyle.title}>SimpleChat</Text>
                    {errorHandler && (
                        <Text style={[globalStyle.errorMsg, {marginTop: 50}]}>{errorHandler}</Text>
                    )}
                    <View style={styles.formContainer}>
                        <TextInput placeholder='Digite seu email' style={styles.inputText} onChangeText={setEmail} value={email}/>
                        <TextInput placeholder='Digite sua senha' style={styles.inputText} onChangeText={setSenha} value={senha} secureTextEntry={true}/>
                        <View style={styles.buttonContainer}>
                            <Button text={"Entrar"} onpress={handlingForm} />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <Text style={styles.footerTitle}>Ainda não possui conta?</Text>
                        {/* Link */}
                        <TouchableOpacity onPress={() => {navigation.navigate("Register")}}>
                            <Text style={globalStyle.footerLink}>CADASTRE-SE</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

        </KeyboardAvoidingView>
    )
}

// Style
const styles = StyleSheet.create({
    formContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 30,
        marginTop: 60,
        width: "100%"
    },
    inputText: {
        backgroundColor: "#fff",
        paddingHorizontal: 8,
        paddingVertical: 12,
        width: "60%"
    },
    buttonContainer: {
        marginTop: 20,
        width: "40%"
    },
    footer: {
        marginTop: 150,
        alignItems: "center",
        width: "100%"
    },
    footerTitle: {
        color: "#fff"
    }
})