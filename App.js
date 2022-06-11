import * as React from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import Explore from "./src/containers/Explore/Explore"
import HistoryScreen from "./src/containers/HistoryScreen";
import SettingScreen from "./src/containers/SettingScreen";

const Tab = createBottomTabNavigator();


class App extends React.Component {
  constructor() {
    super();
  }


  render() {
    return (
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Explore'>
            <Tab.Screen name="Explore"
                        component={Explore}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({size, color}) => (<Icon name={"plane"} color={color} size={size}/>)
                        }}
            />
            <Tab.Screen name="History"
                        component={HistoryScreen}
                        options={{
                            tabBarIcon: ({size, color}) => (<Icon name={"history"} color={color} size={size}/>)
                        }} />
            <Tab.Screen name="Settings" component={SettingScreen}
                        options={{
                tabBarIcon: ({size, color}) => (<Icon name={"cog"} color={color} size={size}/>)
            }} />
          </Tab.Navigator>
        </NavigationContainer>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100
  },
});

export default App