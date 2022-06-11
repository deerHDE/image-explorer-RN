import { Dimensions, Image, StyleSheet, FlatList, Text, View, SafeAreaView, Button, TouchableOpacity } from "react-native";
import {useNavigation} from '@react-navigation/native'
import { useIsFocused } from '@react-navigation/native'
import {useFocusEffect} from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {MenuProvider} from 'react-native-popup-menu'
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'

const testMenu = ['a', 'b', 'c', 'd']

const logo = {
    uri: 'https://reactnative.dev/img/tiny_logo.png',
    width: 64,
    height: 64
};
async function removeItemValue(key) {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    }
    catch(exception) {
        return false;
    }
}
function Item({ item }) {
    return (
        <View style={styles.item}>
            <Image style={styles.image} source={{uri: item[1].uri}} />
            <Text>
                {/*<Text>{"\n"}</Text>*/}
                <Text style={styles.timeText}>{item[1].time}</Text>
                <Text>{"\n\n"}</Text>
                <Text style={styles.text}>{item[1].caption}</Text>
            </Text>

        </View>
    );
}
function deleteData(deleteKey) {
    AsyncStorage.removeItem(deleteKey)
        .done()
}


function OnPress() {
    console.log("presseddd")
}

function Delete(){
    console.log("deleting")
}


function HistoryScreen(props) {
    const [images, setImages] = React.useState(global.historyImages)
    const isFocused = useIsFocused();

    const {navigation} = useNavigation()
    useFocusEffect(
        React.useCallback(() => {
            console.log("focused on history")
            setImages(m => global.historyImages);
            return () => {
                console.log("unfocused on history")
            }
        }, [])
    )
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <SafeAreaView style={styles.container}>
                <MenuProvider>
                <FlatList
                    data={images}
                    // TODO: keyExtractor
                    renderItem={({item, index}) => (
                        <Menu>
                            <MenuTrigger
                                triggerOnLongPress={true}
                                customStyles={{
                                    triggerTouchable: {
                                        onPress: ()=>{
                                            props.navigation.navigate('Summary', {uri: item[1].uri})
                                        }
                                    }
                                }}
                            >
                            <Item item={item}/>
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={() => {
                                    console.log('delete');
                                    setImages(m => m.filter(x => x[0] !== item[0]));
                                    global.historyImages.splice(index, 1);
                                    deleteData(item[0])
                                }}>
                                    <Text style={{ color: 'red' }}>Delete</Text>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => alert(`Not called`)}
                                    disabled={true}
                                    text="Disabled"
                                />
                            </MenuOptions>
                        </Menu>
                    )}/>
                </MenuProvider>
            </SafeAreaView>
        </View>
    );
}





const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 100,
        marginLeft: 0,
        marginRight: 15
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 20,
        // width: 400
        // padding: 0,
        // marginTop: 0
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    button: {
        padding: 30,
        margin: 10,
    },
    item: {
        backgroundColor: '#D5D8DC',
        padding: 10,
        margin: 0,
        flexDirection:'row',
        width: Dimensions.get('window').width,
        borderWidth: 2,
        borderColor: '#ecf0f1'
    },
    timeText: {
        fontSize: 17,
        paddingTop: 7
    }
});


export default HistoryScreen


