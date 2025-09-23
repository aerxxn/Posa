// screens/AddEncounterScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useCats } from "../CatContext";
import styles from "../styles";
import * as ImagePicker from "expo-image-picker";

export default function AddEncounterScreen({ navigation, route }) {
  const { catId, imageSource } = route.params;
  const { addEncounter } = useCats();
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Camera and media library permissions are needed to add encounter photos."
        );
      }
    })();

    if (imageSource === "camera") {
      handleCameraPicker();
    } else if (imageSource === "gallery") {
      handleImagePicker();
    }
  }, [imageSource]);

  const handleImagePicker = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImageUri(res.assets[0].uri);
    }
  };

  const handleCameraPicker = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImageUri(res.assets[0].uri);
    }
  };

  const handleSaveEncounter = () => {
    if (!imageUri) {
      Alert.alert(
        "Missing Photo",
        "Please take or select a photo for the encounter."
      );
      return;
    }

    const newEncounter = {
      date: new Date().toLocaleDateString(),
      location: location || "Unknown",
      details: details || "No details provided",
      photo: imageUri,
    };

    addEncounter(catId, newEncounter);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.imageInputContainer}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <Text style={styles.imagePlaceholderText}>Tap to Add Photo</Text>
            )}
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Location of Encounter"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Details of Encounter"
            value={details}
            onChangeText={setDetails}
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveEncounter}>
            <Text style={styles.buttonText}>Save Encounter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}