
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/screens/Login/Login';
import Register from './src/screens/Register/Register';
import Profile from './src/screens/Profile/Profile';
import Chat from "./src/screens/Chat/Chat";
import Menu from "./src/screens/Menu/Menu";
import Visiting from "./src/screens/Visiting/Visiting";
import ChatRoom from "./src/screens/ChatRoom/ChatRoom";
import Notification from './src/screens/Notification/Notification';

const Stack = createNativeStackNavigator();

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerTitle: "", headerStyle: {backgroundColor: "#3454D1"}}} initialRouteName={"Login"}>  
                <Stack.Screen name='Login' component={Login} options={{headerShown: false}} />
                <Stack.Screen name='Register' component={Register} options={{headerShown: false}} />
                <Stack.Screen name="Chat" component={Chat} options={{headerShown: false}} />
                <Stack.Screen name="Profile" component={Profile} />  
                <Stack.Screen name="Visiting" component={Visiting} />
                <Stack.Screen name="Menu" component={Menu} options={{headerTitle: "Menu", headerTintColor: "#fff"}} />  
                <Stack.Screen name="ChatRoom" component={ChatRoom} options={{headerShown: false}} />  
                <Stack.Screen name="Notification" component={Notification} options={{headerTitle: "Notificações", headerTintColor: "#fff"}} />
            </Stack.Navigator>
        </NavigationContainer>
    )

}
