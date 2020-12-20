import { Camera } from 'expo-camera';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from '../components/Themed';



const CameraRecording: FunctionComponent = () => {
    let [cameraType, setCameraType] = useState(Camera.Constants.Type.front);
    let [seeingFace, setSeeingFace] = useState(true);
    let [permissions, setHasPermission] = useState(false);
    let [camera, setCamera] = useState<Camera | null>(null);
    useEffect(() => {
        Camera.requestPermissionsAsync()
            .then(response => {
                setHasPermission(response.status === 'granted');
            });
    }, []);
    if (!permissions) {
        return (<Text>Please give permissions</Text>)
    }
    return (
        <View style={Styles.container}>
            <Camera style={Styles.camera}
                type={cameraType}
                onFacesDetected={(face) => setSeeingFace(face.faces.length > 0)}
                ref={(camera) => setCamera(camera)}/>
            <View style={Styles.bottomRow}>
                <Button style={Styles.flip} onPress={() => {
                    setCameraType(cameraType == Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front)
                }}> 
                    <Text style={Styles.text}>Flip</Text> 
                </Button>
                <Button style={Styles.takePicture} onPress={() => {
                    if (camera) {
                        camera.takePictureAsync()
                            .then(pic => {
                                console.log(pic.uri);
                            })
                    }
                }}>
                    <Text style={Styles.text}>Take Picture</Text>
                </Button>
                {!seeingFace && <Text style={Styles.faceShow}>Show your face</Text>}
            </View>
            
        </View>
        
    )
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        alignItems: 'baseline'
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    flip: {
        flex: 1,
        backgroundColor: '#0000'
    },
    bottomRow: {
        bottom: 0,
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        padding: 10,
        backgroundColor: '#0000'
    },
    takePicture: {
        flex: 1,
        backgroundColor: '#0000'
    },
    text: {
        color: 'black',
        textAlign: 'center'
    },
    faceShow: {
        color: 'black',
        textAlign: 'center',
        flex: 1,
        backgroundColor: 'green'
    }
});

export default CameraRecording;