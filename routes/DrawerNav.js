import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNav from './BottomTabNav';
import CustomDrawerContent from '../components/CustomDrawerContent';
import { MaterialIcons } from '@expo/vector-icons';
const Drawer = createDrawerNavigator();
const DrawerNav = ()=>{
    return (
        <Drawer.Navigator
        drawerContent={ props => <CustomDrawerContent {...props} /> }
        >
        <Drawer.Screen 
          name="Inscription" 
          component={BottomTabNav} 
           options={{
           headerShown:false
            }}
         />
      </Drawer.Navigator>
    )
}
export default DrawerNav;