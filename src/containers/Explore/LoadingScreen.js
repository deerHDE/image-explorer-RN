import { ActivityIndicator, FlatList, StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from 'react'
// import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import DoubleClick from "../ClickHandler/DoubleClick";
// import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';

class LoadingScreen extends React.Component {
    constructor() {
        super()
        this.onDoubleClick = this.onDoubleClick.bind(this)
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
                <DoubleClick style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onDoubleClick={this.onDoubleClick} timeout={300}>
                    <Text>
                        Connecting with server. This may take a few seconds.
                    </Text>
                    <ActivityIndicator></ActivityIndicator>
                </DoubleClick>
            </View>
        )
    }

    onDoubleClick() {
        this.props.navigation.navigate(this.props.route.params.nextScreen, { uri: this.props.route.params.uri })
    }
}

export default LoadingScreen