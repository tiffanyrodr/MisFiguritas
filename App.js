import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [fotos, setFotos] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [pantalla, setPantalla] = useState('camara');
  const camaraRef = useRef(null);

  if (!permission?.granted || !locationPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text>Necesitamos permisos de cámara y ubicación</Text>
        <TouchableOpacity onPress={() => {
          requestPermission();
          requestLocationPermission();
        }}>
          <Text>Dar permisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tomarFoto = async () => {
    const foto = await camaraRef.current.takePictureAsync();

    const ubicacion = await Location.getCurrentPositionAsync({});
    const latitud = ubicacion.coords.latitude.toFixed(6);
    const longitud = ubicacion.coords.longitude.toFixed(6);

    const { sound } = await Audio.Sound.createAsync(
      require('./assets/sounds/shutter.mp3')
    );
    await sound.playAsync();

    setFotos([...fotos, { uri: foto.uri, latitud, longitud, descripcion }]);
    setDescripcion('');
  };

  if (pantalla === 'galeria') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Fotos</Text>

        <TouchableOpacity style={styles.boton} onPress={() => setPantalla('camara')}>
          <Text>Ir a la cámara</Text>
        </TouchableOpacity>

        <FlatList
          data={fotos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Image source={{ uri: item.uri }} style={styles.foto} />
              <Text>Lat: {item.latitud}</Text>
              <Text>Lon: {item.longitud}</Text>
              <Text>{item.descripcion}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No hay fotos todavía</Text>}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bitácora Geográfica</Text>

      <CameraView style={styles.camara} ref={camaraRef} />

      <TextInput
        style={styles.input}
        placeholder="Escribe una descripción..."
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity style={styles.boton} onPress={tomarFoto}>
        <Text>Tomar Foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonGaleria} onPress={() => setPantalla('galeria')}>
        <Text>Ver fotos ({fotos.length})</Text>
      </TouchableOpacity>
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
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginVertical: 8,
    borderRadius: 8,
  },
  boton: {
    backgroundColor: 'yellow',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  botonGaleria: {
    backgroundColor: 'lightblue',
    padding: 10,
    margin: 5,
    borderRadius: 8,
  },
  tarjeta: {
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
  },
  foto: {
    width: 200,
    height: 200,
    marginBottom: 5,
  },
});