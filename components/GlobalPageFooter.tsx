import React from "react";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import NewCheckList from "./NewCheckList/NewCheckList";
import EditCheckList from "./ManageChecklist/EditCheckList";
import MainPage from "./MainPage/MainPage";
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const FooterMenu = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  if (route.name === 'Home') {
                    iconName = focused ? 'home' as const : 'home' as const ;
                  } else if (route.name === 'New List') {
                    iconName = focused ? 'add-circle' as const  : 'add-circle-outline' as const ;
                  } else if (route.name === 'Edit List') {
                    iconName = focused ? 'list' as const : 'list' as const;
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
              })}
            >
            <Tab.Screen 
                name="Home"
                component={MainPage}
                 />
            <Tab.Screen 
                name="New List" 
                component={NewCheckList} />
            <Tab.Screen 
                name="Edit List" 
                component={EditCheckList} />
        </Tab.Navigator>
    );
}

export default FooterMenu;