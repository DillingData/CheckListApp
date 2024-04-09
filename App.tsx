import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import FooterMenu from './components/GlobalPageFooter';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditOrDeleteList from './components/ManageChecklist/EditOrDeleteList';

export default function App() {
  return (
    
    <NavigationContainer>
      <FooterMenu />
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});