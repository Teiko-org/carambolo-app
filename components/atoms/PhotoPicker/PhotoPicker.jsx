import { useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import PropTypes from "prop-types";

const PhotoPicker = ({ onPhotoSelected, photo = null, placeholder = "Adicionar foto" }) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos de acesso à câmera para tirar fotos.",
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissão da câmera:", error);
      return false;
    }
  };

  const requestMediaPermission = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos de acesso à galeria para selecionar fotos.",
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Erro ao solicitar permissão da galeria:", error);
      return false;
    }
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0];
        onPhotoSelected(photoUri);
      }
    } catch (error) {
      console.error("Erro ao tirar foto:", error);
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickPhoto = async () => {
    const hasPermission = await requestMediaPermission();
    if (!hasPermission) return;

    setIsLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0];
        onPhotoSelected(photoUri);
      }
    } catch (error) {
      console.error("Erro ao selecionar foto:", error);
      Alert.alert("Erro", "Não foi possível selecionar a foto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoSelected(null);
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.photoContainer}>
          <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemovePhoto}
            disabled={isLoading}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderIcon}>📷</Text>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={handleTakePhoto}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>📸 Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={handlePickPhoto}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🖼️ Galeria</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

PhotoPicker.propTypes = {
  onPhotoSelected: PropTypes.func.isRequired,
  photo: PropTypes.shape({
    uri: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  placeholder: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginVertical: 12,
  },
  photoContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  photoPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholderContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#A47032",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFEEE7",
    gap: 8,
  },
  placeholderIcon: {
    fontSize: 48,
  },
  placeholderText: {
    color: "#A47032",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButton: {
    backgroundColor: "#A47032",
  },
  galleryButton: {
    backgroundColor: "#D4B076",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});

export default PhotoPicker;
