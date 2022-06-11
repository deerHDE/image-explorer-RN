import { FlatList, StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import React from 'react'

class SettingScreen extends React.Component {
    constructor() {
        super()
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Setting Screen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100
    },
});

export default SettingScreen