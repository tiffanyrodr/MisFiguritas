import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [fotos, setFotos] = useState([]);
  const camaraRef = useRef(null);

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Necesitamos permiso de cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tomarFoto = async () => {
    const foto = await camaraRef.current.takePictureAsync();

    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sounds/shutter.mp3')
    );
    await sound.playAsync();

    setFotos([...fotos, foto.uri]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Figuritas Repetidas</Text>

      <CameraView style={styles.camara} ref={camaraRef} />

      <TouchableOpacity style={styles.boton} onPress={tomarFoto}>
        <Text>Tomar Foto</Text>
      </TouchableOpacity>

      <FlatList
        data={fotos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.foto} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  camara: {
    width: '90%',
    height: 250,
  },
  boton: {
    backgroundColor: 'yellow',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  foto: {
    width: 100,
    height: 100,
    margin: 5,
  },
});
