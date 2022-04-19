import { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Camera } from 'expo-camera';

export default function CameraModal({ route, navigation }) {
    const [hasCameraPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);

    const camera = useRef();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    });

    if(hasCameraPermission === null || hasCameraPermission === false)
        return (
            <View style={styles.container}>
                <Text>Can't access camera</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <Camera ratio="16:9" pictureSize="640x360" ref={camera} style={styles.camera} type={cameraType}>
            </Camera>
                <View style={styles.toolbar}>
                    <TouchableOpacity style={styles.photoButton} onPress={() => {
                        (async () => {
                            if(camera.current) {
                                let photo = await camera.current.takePictureAsync({ quality: 0.0, base64: true });
                                navigation.navigate({ name: 'AddItem', params: { imageData: photo.base64 }, merge: true, });
                            }
                        })();
                    }}>
                        <Image source={require('../img/camera.png')} />
                    </TouchableOpacity>
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    camera: {
        width: '100%',
        height: '82%'
    },

    toolbar: {
        marginTop: 'auto',
        marginBottom: 48,
        width: '100%',
        alignItems: 'center',
    },

    photoButton: {
        borderRadius: 75,
        padding: 16,
        backgroundColor: '#fbb',
    }
});