
import { View, Text, StyleSheet, Image, ScrollView, Modal, Pressable, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Status from '../../components/Status';
import { StatusBar } from 'expo-status-bar';
import Friend from '../../components/Friend';
import Button from '../../components/Button';
import { ProfileInterface } from "../../interfaces/ProfileDataInterface"
import statusColor from "../../helper/statusColor"
import { API_URL } from '../../../constants';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import mime from "mime"
import { useIsFocused } from '@react-navigation/native';

export default function Profile({navigation}) {

    // Modal States
    const [statusModal, setStatusModal] = useState<boolean>(false);
    const [passwordModal, setPasswordModal] = useState<boolean>(false);
    const [nameModal, setNameModal] = useState<boolean>(false);
    const [bioModal, setBioModal] = useState<boolean>(false);

    // Data States
    const [data, setData] = useState<ProfileInterface>();
    const [backup, setBackup] = useState<ProfileInterface>()
    const [token, setToken] = useState<string>();
    const [senhas, setSenhas] = useState({senha: "", confirmaSenha: ""});

    const isFocused = useIsFocused();

    useEffect(() => {

        async function encapsulating() {
            // Fazer protecao caso o token seja invalido
            const t = await SecureStore.getItemAsync("jwt_token");

            const {data: d} = await axios.get(API_URL + "/profile", {
                headers: {
                    "authorization": t
                }
            })

            if(d.error) {
                // Enviar para a aba de login
                navigation.navigate("Login")
            } else {
                // Seta os dados
                setData(d);
                setBackup(d);
                setToken(t);
            }
        }

        encapsulating();

    }, [isFocused])

    if(!data) return;

    async function changePasswordHandler() {

        if(!senhas.senha) return;

        if(senhas.senha !== senhas.confirmaSenha) {
            return Alert.alert("Falha", "As senhas devem se coincidir", [{
                text: "Ok"
            }])
        };
        // Enviar para a api
        const {data: d} = await axios.post(API_URL + "/profile/password", {
            password: senhas.senha
        }, {headers: {
            "Authorization": token
        }})

        if(d.error) {
            // Error Handling
            return Alert.alert("Falha", "Houve um erro ao trocar de senha, por favor tente novamente!", [{text: "Ok"}])
        } else {
            // Mensagem de sucesso
            setPasswordModal(false);
            return Alert.alert("Sucesso", "senha alterada com sucesso!", [{text: "Ok"}])
        }

    }

    async function changeNameHandler() {
        // Error Handling
        if(data.nome.length < 5) {
            return Alert.alert("Falha", "O nome de usuario deve conter no minimo 5 caracteres!", [{text: "Ok"}])
        }

        const {data: d} = await axios.post(API_URL + "/profile/name", {
            name: data.nome
        }, {
            headers: {
                "Authorization": token
            }
        })

        if(d.error) {
            // mensagem de erro
            // Backup
            setData((prev) => {return {...prev, nome: backup.nome}})
            return Alert.alert("Falha", "Houve um erro ao trocar de nome, por favor tente novamente!", [{text: "Ok"}])
        } else {
            // Fecha modal
            setNameModal(false);
            return Alert.alert("Sucesso", "Nome alterado com sucesso!", [{text: "Ok"}])
        }

    }

    async function changeBioHandler() {

        const { data: d } = await axios.post(API_URL + "/profile/bio", {bio: data.bio}, {
            headers: {
                "Authorization": token
            }
        })
        
        console.log(d);

        if(d.error) {
            // Error handling
            // Backup
            setData((prev) => {return {...prev, bio: backup.bio}})
            return Alert.alert("Falha", "Houve um erro ao trocar de bio, por favor tente novamente!", [{text: "Ok"}])
        } else {
            // Close modal
            setBioModal(false);
        }

    }

    async function changeImageHandler() {
        
        let image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1
        })

        if(!image.canceled) {
            // FormData
            const formData: any = new FormData();

            formData.append("profilePic", {
                uri: image.assets[0].uri,
                type: mime.getType(image.assets[0].uri),
                name: image.assets[0].uri.split('/').pop()
            });

            // Enviar para a API
            const { data: d } = await axios.post(API_URL + "/profile/photo", formData, {
                headers: {
                    "Authorization": token,
                    "Content-Type": "multipart/form-data"
                },
                transformRequest: (data) => {
                    return data;
                }
            })

            // Fazer a validacao
            if(d.error) {
                return Alert.alert("Falha", "Houve um erro ao trocar de foto de perfil, por favor tente novamente!", [{text: "Ok"}]);
            } else {
                // Caso de certo mudar a foto de perfil
                setData((prev) => {
                    return {...prev, profilePic: d.profilePic}
                })
            }

        } else {
            // Error Handling
            return Alert.alert("Falha", "Houve um erro ao trocar de foto de perfil, por favor tente novamente!", [{text: "Ok"}]);
        }

    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.containerWrapper}>
                {/* Profile Pic */}
                <Pressable style={styles.profileImageContainer} onPress={changeImageHandler}>
                    {/* @ts-ignore */}
                    <Image style={[styles.profilePic, {borderColor: statusColor(data.status)}]} source={{
                        uri: data.profilePic ? `http://10.0.2.2:4000/files/${data.profilePic}` : "https://www.pngkey.com/png/detail/121-1219231_no-image-png.png"
                    }}/>
                    <Text style={styles.profileName}>{data.nome}</Text>
                </Pressable>
                {/* BIO */}
                <View style={styles.bioWrapper}>
                    <Text style={styles.sessionTitle}>Bio</Text>
                    <View style={styles.bioTextBox}>
                        <Text style={styles.bioText}>
                            {data.bio.length == 0 && (<Text>Nenhuma informação!</Text>)}
                            {data.bio}
                        </Text>
                    </View>
                    <View style={styles.editBioBtn}><Button text='Editar' onpress={() => setBioModal(!bioModal)} /></View>
                </View>
                {/* Config */}
                <View style={styles.configWrapper}>
                    <Text style={styles.sessionTitle}>Configuração</Text>
                    <Text style={styles.configButton} onPress={() => setStatusModal(!statusModal)}>Mudar Status</Text>
                    <Text style={styles.configButton} onPress={() => setPasswordModal(!passwordModal)}>Trocar senha</Text>
                    <Text style={styles.configButton} onPress={() => setNameModal(!nameModal)}>Alterar nome de usuario</Text>
                    {/* Status Modal */}
                    <Modal visible={statusModal} animationType='fade' transparent={true}>
                        <Pressable onPress={() => setStatusModal(!statusModal)} style={styles.overlay}/>
                        <View style={styles.statusModalWrapper}>
                            <Status status={"Online"} closeModal={setStatusModal} setData={setData}/>
                            <View style={styles.borderBottomView} />
                            <Status status={"Ocupado"} closeModal={setStatusModal} setData={setData}/>
                            <View style={styles.borderBottomView} />
                            <Status status={"Ausente"} closeModal={setStatusModal} setData={setData}/>
                        </View>

                    </Modal>

                    {/* Password Modal */}
                    <Modal visible={passwordModal} animationType='fade' transparent={true}>
                    <Pressable onPress={() => setPasswordModal(!passwordModal)} style={styles.overlay}/>
                        <View style={styles.passwordChangeWrapper}>
                            <View style={styles.passwordInputWrapper}>
                                <TextInput style={styles.passwordInput} secureTextEntry={true} placeholder='Digite sua nova senha' onChangeText={(t) => {setSenhas(prev => {
                                    return {...prev, senha: t}
                                })}}/>
                                <View style={styles.borderBottomView} />
                                <TextInput style={styles.passwordInput} secureTextEntry={true} placeholder='Confirme sua nova senha' onChangeText={(t) => {setSenhas(prev => {
                                    return {...prev, confirmaSenha: t}
                                })}}/>
                            </View>
                            <Button text='Confirmar' onpress={changePasswordHandler}/>
                        </View>
                    </Modal>

                    {/* Name Modal */}
                    <Modal visible={nameModal} animationType='fade' transparent={true}>
                    <Pressable onPress={() => setNameModal(!nameModal)} style={styles.overlay}/>
                        <View style={styles.passwordChangeWrapper}>
                            <View style={styles.passwordInputWrapper}>
                                <TextInput style={styles.passwordInput} placeholder='Digite seu novo nome' onChangeText={(text) => {
                                    setData((prev) => {
                                        return {...prev, nome: text}
                                    })
                                }}/>
                            </View>
                            <Button text='Confirmar' onpress={changeNameHandler}/>
                        </View>
                    </Modal>

                    {/* Bio Modal */}
                    <Modal visible={bioModal} animationType='fade' transparent={true}>
                    <Pressable onPress={() => setBioModal(!bioModal)} style={styles.overlay}/>
                        <View style={styles.bioChangeWrapper}>
                            <Text style={styles.bioTitle}>Editar Bio</Text>
                            <View style={styles.bioInputWrapper}>
                                <TextInput editable multiline value={data.bio} onChangeText={
                                    (text) => setData((prev) => {
                                        return {...prev, bio: text};
                                    })
                                }/>
                            </View>
                            <Button text='Confirmar' onpress={changeBioHandler}/>
                        </View>
                    </Modal>

                </View>
                {/* FriendList */}
                <View style={styles.friendWrapper}>
                    <Text style={styles.sessionTitle}>Amigos</Text>
                    <View style={styles.friendList}>
                        {data.amigos.length == 0 && (
                            <Text style={{fontWeight: "bold", fontSize: 16, padding: 10}}>
                                Nenhum amigo adicionado!
                            </Text>
                        )}
                        {data.amigos.map(amigo => (
                            <Friend friendName={amigo.nome} friendStatus={amigo.status} friendPhoto={amigo.profilePic} key={amigo.email} onPress={() => navigation.navigate("Visiting", {
                                email: amigo.email
                            })}/>
                        ))}
                    </View>
                </View>
                <StatusBar hidden={true} />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    profileImageContainer: {
        alignItems: "center",
        marginTop: 50,
        width: "100%",
        position: "relative"
    },
    profilePic: {
        height: 180,
        width: 180,
        borderRadius: 99,
        borderWidth: 2,
        borderColor: "#000",
    },
    // Limitar um tamanho para o nome de perfil
    profileName: {
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
    bioWrapper: {
        marginTop: 50
    },
    editBioBtn: {
        width: "20%",
        marginLeft: "auto",
        marginTop: 5
    },
    sessionTitle: {
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
    configWrapper: {
        marginTop: 50
    },
    configButton: {
        backgroundColor: "#EFFAFD",
        padding: 15,
        width: "100%",
        marginVertical: 10,
        fontSize: 16,
        fontWeight: "500"
    },
    statusModalWrapper: {
        backgroundColor: "#3454D1",
        padding: 15,
        opacity: 1,
        position: "absolute",
        top: '50%',
        left: '50%',
        width: "50%",
        gap: 15,
        transform: [{translateX: -100}, {translateY: -50}]
    },
    borderBottomView: {
        width: "80%",
        marginLeft: "auto",
        marginRight: "auto",
        backgroundColor: "#000",
        padding: 0.5
    },
    friendWrapper: {
        marginTop: 30,
        marginBottom: 40
    },
    friendList: {
        backgroundColor: "#EFFAFD",
        padding: 10,
        marginTop: 8,
        gap: 8
    },
    passwordChangeWrapper: {
        top: '50%',
        left: '50%',
        width: "50%",
        transform: [{translateX: -100}, {translateY: -50}],
        backgroundColor: "#3454D1",
    },
    overlay: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.7,
        backgroundColor: "#fff"
    },
    passwordInputWrapper: {
        padding: 10,
        gap: 15,
        marginBottom: 5
    },
    passwordInput: {
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4
    },
    bioInput: {
        color: "#000",
        backgroundColor: "#fff"
    },
    bioChangeWrapper: {
        top: '50%',
        left: '50%',
        width: "70%",
        transform: [{translateX: -140}, {translateY: -60}],
        backgroundColor: "#3454D1",
    },
    bioTitle: {
        padding: 4,
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 10
    },
    bioInputWrapper: {
        backgroundColor: "#fff", 
        width: "90%", 
        marginLeft: "auto", 
        marginRight: "auto", 
        padding: 8, 
        marginVertical: 10
    }
})