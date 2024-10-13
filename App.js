import React from "react";
import { NavigationContainer } from "@react-navigation/native";

import DrawerNav from './routes/DrawerNav'
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./routes/Login";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ProfileProvider } from "./redux/ProfileProvider";


export default function App() {
  const Stack = createStackNavigator();
  return (
    <ProfileProvider>
    <Provider store={store} >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="Login" component={Login}
            options={{ title: "connexion" }}
          />
          <Stack.Screen name="Home" component={DrawerNav}
      
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
    </ProfileProvider>
  );
}