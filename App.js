import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, TextInput } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Audio } from 'expo-av';
import * as Location from 'expo-location';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [figuritas, setFiguritas] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [pantalla, setPantalla] = useState('camara');
  const [denegado, setDenegado] = useState(false);
  const camaraRef = useRef(null);

  if (!permission?.granted || !locationPermission?.granted) {
    return (
      <View style={styles.fondoPermisos}>
        <View style={styles.cuadroPermisos}>
          {denegado ? (
            <Text style={styles.textoDenegado}>
              La app necesita los permisos para funcionar correctamente.
            </Text>
          ) : (
            <Text style={styles.textoPermisos}>
              Necesitamos permisos de cámara y ubicación
            </Text>
          )}
          <TouchableOpacity style={styles.btnPermitir} onPress={() => {
            setDenegado(false);
            requestPermission();
            requestLocationPermission();
          }}>
            <Text style={{ color: 'white' }}>Permitir</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnDenegar} onPress={() => setDenegado(true)}>
            <Text>No permitir</Text>
          </TouchableOpacity>
        </View>
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

    setFiguritas([...figuritas, { uri: foto.uri, latitud, longitud, descripcion }]);
    setDescripcion('');
  };

  if (pantalla === 'repetidas') {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Mis Repetidas</Text>

        <TouchableOpacity style={styles.boton} onPress={() => setPantalla('camara')}>
          <Text>Agregar figurita</Text>
        </TouchableOpacity>

        <FlatList
          data={figuritas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.tarjeta}>
              <Image source={{ uri: item.uri }} style={styles.foto} />
              <Text>{item.descripcion}</Text>
              <Text>Lat: {item.latitud}</Text>
              <Text>Lon: {item.longitud}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No tenés figuritas repetidas todavía</Text>}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Figuritas</Text>

      <CameraView style={styles.camara} ref={camaraRef} />

      <TextInput
        style={styles.input}
        placeholder="Jugador y cantidad (ej: Mbappe x3)"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity style={styles.boton} onPress={tomarFoto}>
        <Text>Guardar figurita</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonGaleria} onPress={() => setPantalla('repetidas')}>
        <Text>Ver repetidas ({figuritas.length})</Text>
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
  fondoPermisos: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  cuadroPermisos: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    gap: 10,
  },
  textoPermisos: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 15,
  },
  textoDenegado: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 15,
    color: 'red',
  },
  btnPermitir: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  btnDenegar: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    width: '100%',
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