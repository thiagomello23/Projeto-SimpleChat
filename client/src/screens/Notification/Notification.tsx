import React, { useState, useEffect } from 'react'
import { View, FlatList } from "react-native"
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '../../../constants';
import FriendNotification from '../../components/FriendNotification';

export default function Notification({navigation}) {

    const [data, setData] = useState();
    const [update, setUpdate] = useState<boolean>(false);

    useEffect(() => {

        async function encapsulating() {

            // Fazer protecao caso o token seja invalido
            const t = await SecureStore.getItemAsync("jwt_token");

            const {data: d} = await axios.get(API_URL + "/menu/notify", {
                headers: {
                    "authorization": t
                }
            })

            if(d.error) {
                navigation.navigate("Login");
            } else {
                setData(d);
                setUpdate(false);
            }

        }
        encapsulating();
    }, [update])

    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>
            <FlatList 
                data={data}
                renderItem={({item}) => (
                    <FriendNotification data={item} setUpdate={setUpdate} />
                )}
            />
        </View>
    )
}
