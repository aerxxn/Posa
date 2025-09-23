// screens/AddCatScreen.js
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

export default function AddCatScreen({ navigation, route }) {
  const { imageSource } = route.params || {};
  const [name, setName] = useState("");
  const [eye, setEye] = useState("");
  const [color, setColor] = useState("");
  const [behavior, setBehavior] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const { addCat } = useCats();

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Camera and media library permissions are needed to add cat photos."
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

  const handleSaveCat = () => {
    if (!name || !imageUri) {
      Alert.alert(
        "Missing Info",
        "Please enter the cat's name and select a profile picture."
      );
      return;
    }

    const newCat = {
      name,
      eye,
      color,
      behavior,
      imageUri,
      encounters: [{
        date: new Date().toLocaleDateString(),
        location: location || "Unknown",
        details: details || "No details provided",
        photo: imageUri,
      }]
    };

    addCat(newCat, () => {
      navigation.goBack();
    });
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>New Cat Acquired!</Text>
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
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Eye Color (optional)"
            value={eye}
            onChangeText={setEye}
          />
          <TextInput
            style={styles.input}
            placeholder="Fur Color (optional)"
            value={color}
            onChangeText={setColor}
          />
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Behavior/Personality (optional)"
            value={behavior}
            onChangeText={setBehavior}
            multiline
          />
          
          <Text style={styles.subtitle}>First Encounter</Text>
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

          <TouchableOpacity style={styles.button} onPress={handleSaveCat}>
            <Text style={styles.buttonText}>Save Cat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}