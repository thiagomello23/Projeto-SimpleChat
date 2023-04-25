
import { useEffect, useState } from "react"
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login/Login';
import Register from './src/screens/Register/Register';
import Profile from './src/screens/Profile/Profile';
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import Chat from "./src/screens/Chat/Chat";
import Menu from "./src/screens/Menu/Menu";
import Visiting from "./src/screens/Visiting/Visiting";

const Stack = createNativeStackNavigator();

export default function App() {

    const [validation, setValidation] = useState<boolean>(true);

    useEffect(() => {
        async function validationEncap() {
            // Chamada de API para verificacao do token
            // Libera as rotas se necessario ou nao
            // const validatingInitialRoute = validation ? "Login" : "Chat";
        }
    }, [])

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerTitle: "", headerStyle: {backgroundColor: "#3454D1"}}}>  
                <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
                <Stack.Screen name='Register' component={Register} options={{headerShown: false}} />
                <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
                <Stack.Screen name="Profile" component={Profile} />  
                <Stack.Screen name="Visiting" component={Visiting} />
                <Stack.Screen name="Menu" component={Menu} options={{headerTitle: "Menu", headerTintColor: "#fff"}} />    
            </Stack.Navigator>
        </NavigationContainer>
    )

}