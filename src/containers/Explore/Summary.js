import { Dimensions, SafeAreaView, FlatList, StyleSheet, Text, View, Image, SectionList, StatusBar, Button } from "react-native";
import React from 'react'
// import {BottomMenu, Item} from "react-native-bottom-menu";
// import Icon from 'react-native-vector-icons/FontAwesome'

import data from '../../../input/data'
import DoubleClick from "../ClickHandler/DoubleClick"
import {Alert} from "react-native-web";

const DATA = data.data[0].summary;
const ListItem = ({ title }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const ITEM_HEIGHT = 60;


const hasBorder = {
    borderStyle: 'dotted',
    borderWidth: 2,
    borderRadius: 1,
}

// border for not selected object
const noBorder = {
    borderStyle: 'dotted',
    borderWidth: 0,
    borderRadius: 0,
}

const scrollSection = 0;
const scrollItem = 0;


class Summary extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedCat: 0,
            selectedIndex: 0,
            selectTitle: true
        }
        data.data[0].name = "beddddroom";
        this.renderItem = this.renderItem.bind(this)
        this.renderSectionHeader = this.renderSectionHeader.bind(this)
        this.scrollToSection = this.scrollToSection.bind(this)
        this.getItemLayout = this.getItemLayout.bind(this)
        this.onDoubleClick = this.onDoubleClick.bind(this)
        // Speech.speak("Showing summary of the image. Double tap to explore in details", { language: 'en' });
    }

    scrollToSection = () => {
        this.sectionListRef.scrollToLocation({
            animated: true,
            sectionIndex: this.state.selectedCat,
            itemIndex: this.state.selectedIndex,
            viewPosition: 0.5,
            // viewOffset: 50
        });
    };

    getItemLayout = (data, index) => ({
        index: index,
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index
    })

    renderItem({ item }) {
        return (
            <View style={styles.item}>
                <ListItem title={item} />
            </View>
        )
    };

    renderSectionHeader({ section: { title } }) {
        return (
            <Text style={styles.header}>{title}</Text>
        )
    }

    render() {
        const config = {
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80
        };
        return (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <SafeAreaView style={styles.container}>
                        <Image source={{ uri: this.props.route.params.uri }} style={{ width: 300, height: 300, justifyContent: 'center', alignItems: 'center' }} />
                        <SectionList
                            sections={DATA}
                            stickySectionHeadersEnabled={false}
                            ref={ref => (this.sectionListRef = ref)}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => <ListItem title={item} />}
                            renderSectionHeader={this.renderSectionHeader}
                            getItemLayout={this.getItemLayout}
                        />
                        <View style={{ flexDirection:"row", justifyContent: 'space-between' }}>
                            <View style={styles.button} accessible={false} accessibleTraits={"disabled"}>

                                <Button
                                    title="Explore"
                                    accessible={true}
                                    // accessibleLabel={'Explore button'}
                                    onPress={this.onDoubleClick}/>
                            </View>
                            <View style={styles.button}>
                                <Button
                                    title="Reanalyze"/>
                            </View>

                        </View>
                    </SafeAreaView>

        </View>)
    }
    // onSwipe(direction) {
    //     const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    //     switch (direction) {
    //         case SWIPE_LEFT:
    //
    //             if (this.state.selectedIndex > 0) {
    //                 this.setState({ selectedIndex: this.state.selectedIndex - 1 }, () => {
    //                     this.scrollToSection()
    //                     console.log(this.state.selectedCat)
    //                     console.log(this.state.selectedIndex)
    //
    //                 })
    //             }
    //             else if (this.state.selectedIndex === 0) {
    //
    //                 if (!this.state.selectTitle) {
    //                     this.setState({ selectTitle: true }, () => {
    //                         this.scrollToSection()
    //                         console.log(this.state.selectedCat)
    //                         console.log(this.state.selectedIndex)
    //
    //                     })
    //                 }
    //                 else {
    //                     if (this.state.selectedCat > 0) {
    //                         let length = this.state.selectedCat
    //                         this.setState({ selectTitle: false, selectedCat: this.state.selectedCat - 1, selectedIndex: DATA[length - 1].data.length - 1 }, () => {
    //                             this.scrollToSection()
    //                             console.log(this.state.selectedCat)
    //                             console.log(this.state.selectedIndex)
    //
    //                         })
    //                     }
    //                 }
    //
    //             }
    //             break;
    //         case SWIPE_RIGHT:
    //             if (this.state.selectTitle) {
    //                 this.setState({ selectTitle: false }, () => {
    //                     this.scrollToSection()
    //                     console.log(this.state.selectedCat)
    //                     console.log(this.state.selectedIndex)
    //
    //                 })
    //             }
    //             else {
    //                 if (this.state.selectedIndex < DATA[this.state.selectedCat].data.length - 1) {
    //                     this.setState({ selectedIndex: this.state.selectedIndex + 1 }, () => {
    //                         this.scrollToSection()
    //                         console.log(this.state.selectedCat)
    //                         console.log(this.state.selectedIndex)
    //
    //                     })
    //                 }
    //                 else if (this.state.selectedIndex === DATA[this.state.selectedCat].data.length - 1) { // at the end of the list
    //                     if (this.state.selectedCat < DATA.length - 1) {
    //                         this.setState({ selectedCat: this.state.selectedCat + 1, selectedIndex: 0, selectTitle: true }, () => {
    //                             this.scrollToSection()
    //                             console.log(this.state.selectedCat)
    //                             console.log(this.state.selectedIndex)
    //
    //                         })
    //                     }
    //                 }
    //             }
    //             break;
    //     }
    //
    //     // this.scrollToSection()
    //
    // }

    onDoubleClick() {
        console.log("Double click")
        this.props.navigation.navigate('LoadingScreen2')
    }
}


// const DATA = data.data[0].summary;

// const Item = ({ title }) => (
//   <View style={styles.item}>
//     <Text style={styles.title}>{title}</Text>
//   </View>
// );

// const Summary = () => (
//    <View>
//    <Image source={{ uri: this.props.route.params.uri }} style={{ width: 200, height: 200 }} />

//   <SafeAreaView style={styles.container}>
//     <SectionList
//       sections={DATA}
//       keyExtractor={(item, index) => item + index}
//       renderItem={({ item }) => <Item title={item} />}
//       renderSectionHeader={({ section: { title } }) => (
//         <Text style={styles.header}>{title}</Text>
//       )}
//     />
//   </SafeAreaView>
//   </View>
// );

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item: {
        backgroundColor: "#E5E7E9",
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 2,
        // borderRadius: 10,
        // borderColor: "#AED6F1",
        width: 350,

    },
    header: {
        fontSize: 18,
        padding: 10,
        backgroundColor: "#B3B6B7",
        marginVertical: 2,
        // borderWidth: 2,
        // borderRadius: 10,
        // borderStyle: 'dotted',
        // borderColor: '#A9CCE3',
        color: "#34495E",
        width: 350,
        height: 45
    },
    title: {
        fontSize: 18,
        color: '#17202A',
    },
    menu: {
        flex: 1,
        height: 100,
        padding: 0,
        margin: 0,
        position: "absolute",
        bottom: 0,
        left: 0
    },
    button: {
        width: "40%",
        height: 40
    },
});

export default Summary;