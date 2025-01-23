
//////////////////////////////////// nested nav exp by Venky/////////////////////////
// more updatedd with btabs icons

///// BOLX SCRs /////////
import {
  WarehouseContext,
  WarehouseProvider,
} from "./src/Components/Routes/WarehouseContext";
import Login from "./src/Components/Authentication/Login";
import Splash from "./src/Components/Authentication/Splash";

////// DRAWER SCRS ///////
import InnerDashBoardScreen from "./src/Components/CommonScreens/InnerDashBoardScreen";
import OrderPicking from "./src/Components/OrdersPicking/OrderPicking";
import Qc from "./src/Components/RoPoDashboard/Qc";
import BatchPicking from "./src/Components/Batching/BatchPicking";
import Transfering from "./src/Components/Location/Transfering";
import EnquiryScreen from "./src/Components/Inventory/Enquiry_Screen";

/////// BOTTOM TAB //////////
import AssignedOrdersData from "./src/Components/CommonScreens/AssignedOrdersData";
/////////////////////////// headr////
//import { CommonHeader } from "./src/Components/Routes/CommonHeader";
import CommonHeader from "./src/Components/Routes/CommonHeader";

import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from "react-i18next";
import {
  Button,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";

// Stack Navigator
const Stack = createNativeStackNavigator();
// Bottom Tab Navigator
const Tab = createBottomTabNavigator();
// Drawer Navigator
const Drawer = createDrawerNavigator();



// Home Tab Screens
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Home Screen</Text>
  </View>
);


const VenkyScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Venky Screen</Text>
  </View>
);

const RaniScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Rani Screen</Text>
  </View>
);

// Bottom Tabs
// Bottom Tabs
// const BottomTabs = () => (
//   <Tab.Navigator
//     screenOptions={{ headerShown: false }}
//     initialRouteName="HomeTab2"
//   >
//     <Tab.Screen
//       name="OrdrPick_frst"
//       component={OrderPicking}
//       options={{ title: "OrdrPick" }}
//     />
//     <Tab.Screen name="HomeTab2" component={StackNavigator2} />
//     <Tab.Screen
//       name="Service"
//       component={AssignedOrdersData}
//       options={{ title: "Service" }}
//     />
//   </Tab.Navigator>
// );

const BottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'OrdrPick_frst':
            iconName = focused ? 'cart' : 'package-variant-outline';
            break;
          case 'HomeTab2':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Service':
            iconName = focused ? 'wrench' : 'wrench-outline';
            break;
          default:
            iconName = 'circle';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007bff',
      tabBarInactiveTintColor: 'gray',
    })}
    initialRouteName="HomeTab2"
  >
    <Tab.Screen
      name="OrdrPick_frst"
      component={OrderPicking}
      options={{ title: "Order Picking" }}
    />
    <Tab.Screen 
      name="HomeTab2" 
      component={StackNavigator2} 
      options={{ title: "Home" }}
    />
    <Tab.Screen
      name="Service"
      component={AssignedOrdersData}
      options={{ title: "Service" }}
    />
  </Tab.Navigator>
);

// ///////////////////////////////////// Drawer nav /////////////////////////////////////////////

// Custom Drawer Component
const CustomDrawerContent = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.drawerContainer}>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("BottomTabs")}
      >
        <Text style={styles.drawerText}>Tabs</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.drawerText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "InnerHomeDashbrd" },
          })
        }
      >
        <Text style={styles.drawerText}>Innr Dashbrd</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "OrdrPick_frst" },
          })
        }
      >
        <Text style={styles.drawerText}>OrdrPick</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "venky" },
          })
        }
      >
        <Text style={styles.drawerText}>Venky screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "Rani" },
          })
        }
      >
        <Text style={styles.drawerText}>Rani screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "QC" },
          })
        }
      >
        <Text style={styles.drawerText}>QC screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "BatchPicking_new" },
          })
        }
      >
        <Text style={styles.drawerText}>BatchPicking_new screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "Transfering_new" },
          })
        }
      >
        <Text style={styles.drawerText}>Transfering_new screen</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.drawerItem}
        onPress={() =>
          navigation.navigate("BottomTabs", {
            screen: "HomeTab2",
            params: { screen: "EnquiryScreen_new" },
          })
        }
      >
        <Text style={styles.drawerText}>EnquiryScreen_new screen</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

// const CommonHeader = ({ title, subtitle }) => (
//   <View style={styles.headerContainer}>
//     <Text style={styles.title}>{title}</Text>
//     <Text style={styles.subtitle}>{subtitle}</Text>
//   </View>
// );

// /////////////////////// DRAWER NAV ////////////////////////////
// const DrawerNavigator = () => (
//   <Drawer.Navigator
//     screenOptions={{
//       header : (
//         ({options}) => (
//           <CommonHeader title={options.title || 'Default Title'}
//           subtitle="Your Subtitle"/>
//         )
//       )
//     }}
//     drawerContent={(props) => <CustomDrawerContent {...props} />}
//   >
//     <Drawer.Screen name="BottomTabs" component={BottomTabs} />
//     {/* <Drawer.Screen name="Settings" component={SettingsScreen} />
//     <Drawer.Screen name="About" component={AboutScreen} /> */}
//   </Drawer.Navigator>
// );

// const CommonHeader = ({ navigation, title, subtitle }) => (
//   <View style={styles.headerContainer}>
//     <TouchableOpacity
//       onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
//       style={styles.drawerToggle}
//     >
//       <Icon name="menu" size={24} color="black" />
//     </TouchableOpacity>
//     <View style={styles.textContainer}>
//       {/* <Text style={styles.title}>{title}</Text> */}
//       <Text style={styles.subtitle}>{subtitle}</Text>
//     </View>
//   </View>
// );

const DrawerNavigator = () => (
  <Drawer.Navigator
    screenOptions={({ navigation, route, options }) => ({
      header: () => (
        <CommonHeader
          navigation={navigation}
          //  title={options.title || 'Default Title'}
          subtitle="Your Subtitle"
        />
      ),
    })}
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="BottomTabs" component={BottomTabs} />
  </Drawer.Navigator>
);

// Stack Navigator2   ////////////////////// DEEPER STACK SCREENS VSISBLE IN ALL NESTED NAV /////////////////////////////////////////
const StackNavigator2 = () => (
  <Stack.Navigator
    initialRouteName="InnerHomeDashbrd"
    options={{ headerShown: false }}
  >
    <Stack.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="venky"
      component={VenkyScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Rani"
      component={RaniScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="InnerHomeDashbrd"
      component={InnerDashBoardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="OrdrPick_frst"
      component={OrderPicking}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="QC" component={Qc} options={{ headerShown: false }} />
    <Stack.Screen
      name="BatchPicking_new"
      component={BatchPicking}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Transfering_new"
      component={Transfering}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="EnquiryScreen_new"
      component={EnquiryScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// App Container /////////////////////////////////////////// APP.js /////////////////////////////////
export default function App() {
  return (
    <WarehouseProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </WarehouseProvider>
  );
}

// Main Navigator
const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen
      name="Home"
      component={DrawerNavigator}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

// Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  drawerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  drawerText: {
    fontSize: 18,
    color: "#333",
  },
  headerContainer: {
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
});
