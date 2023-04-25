
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import globalStyle from '../../globalStyles'
import Button from '../../components/Button'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../../constants'

export default function Register({navigation}) {

    // States
    const [nome, setNome] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [senha, setSenha] = useState<string>();
    const [confirmaSenha, setConfirmaSenha] = useState<string>();
    const [errorHandler, setErrorHandler] = useState<string|null>(null);

    async function handlingForm() {
        // Ver sobre variaveis de ambiente no react-native
        // Fazer as verificacoes minimas
        if(!nome) {
            setErrorHandler("Nome muito pequeno, minimo 5 caracteres")
            return;
        }

        if(!email) {
            setErrorHandler("Email invalido!")
            return;
        }

        if(!senha) {
            setErrorHandler("As senhas devem conter no minimo 8 caracteres")
            return;
        }

        if(senha !== confirmaSenha) {
            setErrorHandler("As senhas nao condizem")
            return;
        }

        // Enviar para a rota da API
        const { data } = await axios.post(`${API_URL}/auth/register`, {
            nome: nome,
            email: email,
            senha: senha
        })
        
        // Faz a verificacao dos dados
        if(data.error) {
            // Mostra o erro pro usuario
            setErrorHandler(data.msg)
        } else {
            // Salva o token JWT
            await SecureStore.setItemAsync("jwt_token", data.token);
            // Redirecionar
            navigation.navigate("Profile")
        }

    }

    return (
        <KeyboardAvoidingView style={globalStyle.containerBlue} keyboardVerticalOffset={20}>
            <ScrollView>
                <Text style={globalStyle.title}>SimpleChat</Text>
                {errorHandler && (
                    <View style={{marginTop: 50}}>
                        <Text style={globalStyle.errorMsg}>{errorHandler}</Text>
                    </View>
                )}
                <View style={styles.formContainer}>
                    <TextInput placeholder='Digite seu nome' style={styles.inputText} onChangeText={setNome}/>
                    <TextInput placeholder='Digite seu email' style={styles.inputText} onChangeText={setEmail}/>
                    <TextInput placeholder='Digite sua senha' style={styles.inputText} onChangeText={setSenha}/>
                    <TextInput placeholder='Confirme sua senha' style={styles.inputText} onChangeText={setConfirmaSenha}/>
                    <View style={styles.buttonContainer}><Button text={"Cadastrar"} onpress={handlingForm} /></View>
                </View>
                <View style={styles.footer}>
                    <Text style={styles.footerTitle}>Já possui conta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={globalStyle.footerLink}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
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
        width: "50%"
    },
    footer: {
        marginTop: 100,
        alignItems: "center",
        width: "100%"
    },
    footerTitle: {
        color: "#fff"
    },
})