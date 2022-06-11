import { FlatList, StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
// import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
// import DoubleClick from "./ClickHandler/DoubleClick"
// import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from "./Explore/ExploreHome"
import HistoryScreen from "./HistoryScreen";
import SettingScreen from "./SettingScreen";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();


class Home extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Tab.Navigator
                screenOptions={({route})=>({
                    tabBarIcon: ({color, size})=>{
                        let iconName;
                        if (route.name === 'Explore') {
                            iconName = 'home'
                        }
                        else if(route.name === 'Settings') {
                            iconName = 'settings'
                        }
                        return <Ionicons name={iconName} size={size} color={color}/>
                    }
                })}
                >
                <Tab.Screen name="Explore" component={ExploreScreen} />
                <Tab.Screen name="History" component={HistoryScreen} />
                <Tab.Screen name="Settings" component={SettingScreen} />
            </Tab.Navigator>
        );
    };


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100
    },
});

export default Home