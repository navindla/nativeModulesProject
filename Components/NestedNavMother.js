// bugs fixed of BOLX
// 3nested navs



import React from 'react';
import {Button, View, Text, StyleSheet, SafeAreaView , TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

// Stack Navigator
const Stack = createNativeStackNavigator();
// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
// Drawer Navigator
const Drawer = createDrawerNavigator();

// Screens
const LoginScreen = ({navigation}) => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Login Screen</Text>
    <Button title="Login" onPress={() => navigation.replace('Home')} />
  </View>
);

// Home Tab Screens
const HomeScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Home Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Profile Screen</Text>
  </View>
);

// Settings Tab Screens
const SettingsScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Settings Screen</Text>
  </View>
);

const AboutScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>About Screen</Text>
  </View>
);


const VenkyScreen = () => (
  <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text>Venky Screen</Text>
  </View>
);

// Bottom Tabs
const BottomTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="HomeTab2" component={StackNavigator2} />
    <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{title: 'Profile'}} />
  </Tab.Navigator>
);




///////////////////////////////////// Drawer nav /////////////////////////////////////////////

// Custom Drawer Component
const CustomDrawerContent = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('BottomTabs')}
      >
        <Text style={styles.drawerText}>Tabs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={styles.drawerText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate('BottomTabs', {
          screen: 'HomeTab2',
          params: { screen: 'venky' },
        })}
      >
        <Text style={styles.drawerText}>Venky screen</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="BottomTabs" component={BottomTabs} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
    <Drawer.Screen name="About" component={AboutScreen} />
  </Drawer.Navigator>
);


// Stack Navigator
const AppNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen
      name="Home"
      component={DrawerNavigator}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);


// Stack Navigator2
const StackNavigator2 = () => (
  <Stack.Navigator initialRouteName="HomeTab" options={{headerShown: false}}>
    <Stack.Screen name="HomeTab" component={HomeScreen}  options={{headerShown: false}} />
    <Stack.Screen name="venky" component={VenkyScreen} />
  </Stack.Navigator>
);

// App Container
export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}





// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  drawerText: {
    fontSize: 18,
    color: '#333',
  },
});
