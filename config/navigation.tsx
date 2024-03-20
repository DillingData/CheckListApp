import react from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EditOrDeleteList from '../components/ManageChecklist/EditOrDeleteList';

const ChecklistStack = createNativeStackNavigator();

const ChecklistStackScreen = () => {
    return(
        <ChecklistStack.Navigator>
            <ChecklistStack.Screen 
                name="EditOrDelete" 
                component={EditOrDeleteList} />
        </ChecklistStack.Navigator>
    )
};

export default () => {
    <NavigationContainer>
        <ChecklistStackScreen />
    </NavigationContainer>
}