import * as React from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreHome from './ExploreHome';
import LoadingScreen from './LoadingScreen';
import ImageLayer1 from './ImageLayer1';
import Summary from './Summary';

const App = () => {
    console.log("reder app")
    return (<Navigation />)
}

// create navigation stack
const Stack = createNativeStackNavigator();


// navigation of all screens
const Explore = () => {
    return (
        <Stack.Navigator initialRouteName="ExploreHome" >
            <Stack.Screen
                name="ExploreHome"
                options={{ headerShown: false }}
                component={ExploreHome}
            />
            <Stack.Screen
                name="LoadingScreen1"
                options={{ headerShown: false, }}
                component={LoadingScreen}
                initialParams={{ uri: null, nextScreen: "Summary" }}
            />
            <Stack.Screen
                name="Summary"
                component={Summary}
                initialParams={{ uri: null }}
            />
            <Stack.Screen
                name="LoadingScreen2"
                options={{ headerShown: false }}
                component={LoadingScreen}
                initialParams={{ uri: null, nextScreen: "ImageLayer1" }}
            />
            <Stack.Screen
                name="ImageLayer1"
                component={ImageLayer1}
                options={{ headerShown: false }}
                initialParams={{ index: 0, changePosition: true }}
            />
        </Stack.Navigator>
    );
};


export default Explore