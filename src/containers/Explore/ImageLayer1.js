import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View, Image, ImageBackground, Dimensions, Text } from "react-native"
import data from '../../../input/data'
import Svg, { Polyline } from 'react-native-svg';
import DoubleClick from '../ClickHandler/DoubleClick';
import SpeechWrapper from '../../utils/SpeechWrapper'
// import * as Speech from 'expo-speech';

import RCTDirectTouch from '../../utils/DirectTouch'


const speechWrapper = new SpeechWrapper()

const INTERSECT_THRESHOLD = 0.5


class ImageLayer1 extends React.Component {
    constructor() {
        super()

        // get window size
        this.windowWidth = Dimensions.get('window').width
        this.windowHeight = Dimensions.get('window').height

        // object pointed by finger
        this.object = null

        this.state = { mode: "maskrcnn", object: 0 }
        this.showList = null

        // binding
        this.onFingerMove = this.onFingerMove.bind(this)
        this.getPolygon = this.getPolygon.bind(this)
        this.onDoubleClick = this.onDoubleClick.bind(this)
        this.getPointingObject = this.getPointingObject.bind(this)
        this.getShowList = this.getShowList.bind(this)

        //        console.log(NativeModules.DirectTouchModule)
    }



    // store index of pointing object in this.object, -1 if background
    getPointingObject(e) {
        // get current pointing coordinate with respect to image raw pixels
        var y = this.imageHeight - (e.nativeEvent.pageX - (this.windowWidth - this.viewHeight) / 2) * this.imageHeight / this.viewHeight
        var x = (e.nativeEvent.pageY - (this.windowHeight - this.viewWidth) / 2) * this.imageWidth / this.viewWidth

        // background if out of bound
        if (x < 0 || x > this.imageWidth || y < 0 || y > this.imageHeight) {
            this.object = -1
        }
        else {

            if (this.state.mode == "maskrcnn") {
                // use ray casting algorithm to determine if a point is in polygon
                // details: https://en.wikipedia.org/wiki/Point_in_polygon#:~:text=One%20simple%20way%20of%20finding,an%20even%20number%20of%20times.

                this.object = -1

                // round x and y to avoid overlapping lines
                x = Math.round(x) + 0.5, y = Math.round(y) + 0.5

                // starting linear search from the previous index
                let start = this.object == -1 ? 0 : this.object
                for (let i = 0; i < this.maskrcnnData.length; i++) {
                    let intersectCount = 0
                    let index = (i + start) % this.maskrcnnData.length
                    let last = this.maskrcnnData[index].coordinates[0][this.maskrcnnData[index].coordinates[0].length - 1]
                    for (let j = 0; j < this.maskrcnnData[index].coordinates[0].length; j++) {
                        var x1 = this.maskrcnnData[index].coordinates[0][j][0]
                        var y1 = this.maskrcnnData[index].coordinates[0][j][1]
                        var x2 = last[0]
                        var y2 = last[1]
                        if ((x1 - x) * (x2 - x) < 0 && (y1 - y2) * (x - x1) * (x1 - x2) > (y - y1) * (x1 - x2) ** 2) {
                            intersectCount++
                        }
                        last = this.maskrcnnData[index].coordinates[0][j]
                    }
                    if (intersectCount % 2 == 1) {
                        if (this.object != index) {
                            this.object = index
                        }
                        break
                    }
                }
            }
            else {
                this.object = -1
                let start = this.object == -1 ? 0 : this.object
                for (let i = 0; i < this.showList.length; i++) {
                    let index = this.showList[(i + start) % this.showList.length]
                    let box = this.denseData[index].bounding_box
                    if (x > box[0] && x < box[0] + box[2] && y > box[1] && y < box[1] + box[3]) {
                        this.object = index
                        break
                    }
                }
            }
        }
    }

    // when moving finger, read object out aloud
    onFingerMove(e) {
        this.getPointingObject(e)
        if (this.object != -1) {
            var objectName;
            if (this.state.mode == "maskrcnn") {
                objectName = this.maskrcnnData[this.object].label
            }
            else {
                objectName = this.denseData[this.object].caption
            }
            speechWrapper.speak(objectName, this.object, 3000)
            // console.log(objectName)
        }
        else {
            speechWrapper.speak("background", -1, 0)
        }
    }

    // navigate to second layer if double clicking on an object
    // if double clicking on background, go back to home
    onDoubleClick() {
        if (this.state.mode == "maskrcnn") {
            if (this.object != -1) {
                this.setState({ mode: "densecap", object: this.object })
            }
            else {
                this.props.navigation.navigate('ExploreHome', { changePort: true })
            }
        }
        else {
            this.setState({ mode: "maskrcnn", object: null })
        }
    }

    // get index of detailed object to display
    // display detailed objects that have overlapping with maskrcnn object
    // but has little overlapping with other objects already in the list
    getShowList() {
        let coordinateData = this.maskrcnnData[this.state.object].coordinates[0]
        this.showList = []
        for (let i = 0; i < this.denseData.length; i++) {
            // first, get rid of boxed that overlap a lot with boxes already in showList
            let intersection = false
            for (let j = 0; j < this.showList.length; j++) {
                let box1 = this.denseData[i].bounding_box
                let box2 = this.denseData[this.showList[j]].bounding_box

                let x1 = Math.max(box1[0], box2[0])
                let y1 = Math.max(box1[1], box2[1])
                let x2 = Math.min(box1[0] + box1[2], box2[0] + box2[2])
                let y2 = Math.min(box1[1] + box1[3], box2[1] + box2[3])
                if (x1 < x2 && y1 < y2) {
                    // calculate intersection area
                    let intersectionArea = (x2 - x1) * (y2 - y1)
                    if (intersectionArea > box1[2] * box1[3] * INTERSECT_THRESHOLD || intersectionArea > box2[2] * box2[3] * INTERSECT_THRESHOLD) {
                        intersection = true
                        break
                    }
                }
            }
            if (intersection) {
                continue
            }

            // second, find boxes that has overlapping with the object we want to get more details (in maskrcnn)
            let box = this.denseData[i].bounding_box

            for (let j = 0; j < coordinateData.length; j++) {
                let x = coordinateData[j][0]
                let y = coordinateData[j][1]

                if (x > box[0] && x < box[0] + box[2] && y > box[1] && y < box[1] + box[3]) {
                    this.showList.push(i)
                    break
                }
            }
        }
    }

    // draw polygon on image according to the coordinates in data file
    getPolygon() {
        let polygonList = []
        if (this.state.mode == "maskrcnn") {
            for (let i = 0; i < this.maskrcnnData.length; i++) {
                let points = []
                for (let j = 0; j < this.maskrcnnData[i].coordinates[0].length; j++) {
                    // get coordinates with respect to whole screen
                    points.push([
                        this.maskrcnnData[i].coordinates[0][j][0] * this.viewWidth / this.imageWidth,
                        this.maskrcnnData[i].coordinates[0][j][1] * this.viewHeight / this.imageHeight])
                }

                // push first coordinate into the list to connect first and last
                points.push([
                    this.maskrcnnData[i].coordinates[0][0][0] * this.viewWidth / this.imageWidth,
                    this.maskrcnnData[i].coordinates[0][0][1] * this.viewHeight / this.imageHeight])
                polygonList.push(
                    <Polyline
                        key={i}
                        points={points}
                        stroke='white'>
                    </Polyline>
                )
            }
        }
        else {
            for (let i = 0; i < this.showList.length; i++) {
                let box = this.denseData[this.showList[i]].bounding_box
                let x = box[0] * this.viewWidth / this.imageWidth
                let y = box[1] * this.viewHeight / this.imageHeight
                let w = box[2] * this.viewWidth / this.imageWidth
                let h = box[3] * this.viewHeight / this.imageHeight
                let points = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]]
                polygonList.push(
                    <Polyline
                        key={i}
                        points={points}
                        stroke='white'>
                    </Polyline>)
            }
        }

        return <Svg>{polygonList}</Svg>
    }

    render() {
        this.maskrcnnData = data.data[0].json.maskrcnn
        this.denseData = data.data[0].json.captions

        // get image, its raw height and width, and height and width in the screen
        var fn = data.data[0].origin
        const image = Image.resolveAssetSource(fn)
        this.imageHeight = image.height
        this.imageWidth = image.width
        this.viewHeight = this.windowWidth
        this.viewWidth = this.windowWidth * this.imageWidth / this.imageHeight

        // get show list
        if (this.state.mode == "maskrcnn") {
            this.showList = null;
        }
        else {
            this.getShowList()
        }

        // Speech.speak(data.data[0].json.output, { language: 'en' })
        // if (this.props.route.params.changePosition) {
        //     Speech.speak("Charge port to the right", { language: 'en' })
        // }
        return (
            <View style={styles.container}
                onTouchStart={e => this.getPointingObject(e)} // get object on touch to support double click
                onTouchMove={e => this.onFingerMove(e)}
                accessible={true}
                accessibilityLabel={"label label"}
                accessibilityRole={"adjustable"}
            >
                <View></View>
                <RCTDirectTouch accessible={true} style={{ flex: 1 }}>
                    <DoubleClick
                        style={styles.container}
                        timeout={300}
                        onDoubleClick={this.onDoubleClick}
                    >
                        <TouchableWithoutFeedback>
                            <View>
                                <ImageBackground
                                    style={{
                                        transform: [
                                            {
                                                rotate: '90deg',
                                            },
                                        ],
                                        height: this.windowWidth,
                                        width: undefined,
                                        aspectRatio: this.imageWidth / this.imageHeight
                                    }}
                                    resizeMode='contain'
                                    source={image}>
                                    {this.getPolygon()}
                                </ImageBackground>
                            </View>
                        </TouchableWithoutFeedback>
                    </DoubleClick>
                </RCTDirectTouch>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
});

export default ImageLayer1
