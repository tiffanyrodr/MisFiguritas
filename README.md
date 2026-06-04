# MisFiguritas

Con el álbum Panini del mundial en todos lados se me ocurrió hacer una app para 
llevar el control de las figuritas que se repiten. La idea es tomarle foto a las 
que se repiten, guardar dónde estás en ese momento, y que tus amigos puedan ver 
cuáles tenés disponibles para intercambiar.

## Como funciona

- Le tomás foto a tu figurita repetida
- La app guarda automáticamente las coordenadas GPS de donde estás
- Le ponés una descripción con el nombre del jugador y cuántas repetidas tenés (ejemplo: "Mbappe (x3)")
- En la galería se ven todas las fotos con su ubicación y descripción

## Lo que usé

- React Native con Expo
- expo-camera
- expo-location
- expo-av

## Como probarlo en el celular

Clonar el repositorio:

```bash
git clone https://github.com/tiffanyrodr/MisFiguritas.git
cd MisFiguritas
```

Instalar dependencias:

```bash
npm install
npx expo install expo-camera expo-location expo-av
```

Correr la app:

```bash
npx expo start
```

Descargar Expo Go en el celular y escanear el QR que aparece en la terminal.

La app pide permisos de camara y ubicacion al abrirla, hay que aceptarlos.
