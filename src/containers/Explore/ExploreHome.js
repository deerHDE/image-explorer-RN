import {TouchableOpacity, FlatList, StyleSheet, Text, View, SafeAreaView, Button } from "react-native";
import React from 'react'
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage'

global.historyImages = []




let imageID = 0
class ExploreHome extends React.Component {
    constructor() {
        super();
        this.pickImage = this.pickImage.bind(this)
        this.takePhoto = this.takePhoto.bind(this)
        this.getCurrentDate = this.getCurrentDate.bind(this)

    }

    clearData() {
        AsyncStorage.clear()
            .done()
    }
    importData = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            console.log("keys")
            console.log(keys)

            const result = await AsyncStorage.multiGet(keys);
            console.log(result)
            return result.map(x => [x[0].toString(), JSON.parse(x[1])]);
        } catch (error) {
            console.error(error)
        }
    }

    async addImage(uriStr) {
        const imageInfo = [imageID.toString(), {uri: uriStr, time: this.getCurrentDate(), caption: "Picture"}]
        global.historyImages.push(imageInfo)
        const imageInfoJson = JSON.stringify(imageInfo[1])
        await AsyncStorage.setItem(imageID.toString(), imageInfoJson)
        imageID = imageID + 1
    }



    componentDidMount() {
        // this.clearData()
        this.importData().then(r => {
            global.historyImages = r;
            console.log("global images")
            console.log(global.historyImages[0])
        })
    }




    getCurrentDate() {
        let today = new Date();
        var date = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();
        let hours = (today.getHours() < 10 ? '0' : '') + today.getHours();
        let minutes = (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
        let seconds = (today.getSeconds() < 10 ? '0' : '') + today.getSeconds();
        return date + '/' + month + '/' + year + '   ' + hours + ':' + minutes + ':' + seconds;//format: dd-mm-yyyy;
    }


    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Welcome to Image Explorer!</Text>
                <TouchableOpacity
                    style={styles.option}
                    onPress={this.pickImage}>
                    <Text style={styles.buttonText}>Select from Photos</Text>
                </TouchableOpacity>
                {/*<Button title="Select from Photos" onPress={this.pickImage} backgroundColor={"black"}/>*/}
                <TouchableOpacity
                    style={styles.option}
                    onPress={this.takePhoto}>
                    <Text style={styles.buttonText}>Take a Photo</Text>
                </TouchableOpacity>
            </View>
        );
    };


    async pickImage() {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need photos roll permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            // console.log(result.uri)
            await this.addImage(result.uri)
            this.props.navigation.navigate('LoadingScreen1', { uri: result.uri })
        }
    }

    async takePhoto() {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if (!result.cancelled) {
            await this.addImage(result.uri)
            this.props.navigation.navigate('LoadingScreen1', { uri: result.uri })
        }
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 100,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 28,
        color: '#212F3C',
        marginBottom: 80,
        marginTop: 100,
    },
    option: {
        width: 300,
        marginTop: 50,
        padding: 20,
        backgroundColor: '#D6EAF8',
        borderWidth: 2,
        borderRadius: 7,
        borderColor: '#D6EAF8',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 25
    }
});


export default ExploreHome