// screens/AddEncounterScreen.js
// Import necessary React and React Native modules
import React, { useState, useEffect } from "react";
import {
  View, // Container for layout
  Text, // For displaying text
  TextInput, // For user input fields
  TouchableOpacity, // For pressable buttons
  Image, // For displaying images
  Alert, // For showing alerts
  KeyboardAvoidingView, // For handling keyboard overlap
  Platform, // For platform-specific logic
  ScrollView, // For scrollable content
} from "react-native";
import { useCats } from "../CatContext"; // Custom hook for cat data
import styles from "../styles"; // App styles
import * as ImagePicker from "expo-image-picker"; // Image picker library

// Main component for adding a new encounter to a cat
export default function AddEncounterScreen({ navigation, route }) {
  // Get catId and imageSource from navigation route params
  const { catId, imageSource } = route.params;
  // Get addEncounter function from context
  const { addEncounter } = useCats();
  // State for the encounter photo URI
  const [imageUri, setImageUri] = useState(null);
  // State for location input
  const [location, setLocation] = useState("");
  // State for details input
  const [details, setDetails] = useState("");

  // Request permissions and handle image picking based on source
  useEffect(() => {
    (async () => {
      // Request camera and gallery permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Camera and media library permissions are needed to add encounter photos."
        );
      }
    })();

    // Automatically open picker if imageSource is set
    if (imageSource === "camera") {
      handleCameraPicker();
    } else if (imageSource === "gallery") {
      handleImagePicker();
    }
  }, [imageSource]);

  // Opens the image library for user to pick a photo
  const handleImagePicker = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImageUri(res.assets[0].uri);
    }
  };

  // Opens the camera for user to take a photo
  const handleCameraPicker = async () => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImageUri(res.assets[0].uri);
    }
  };

  // Handles saving the new encounter
  const handleSaveEncounter = () => {
    // Require a photo before saving
    if (!imageUri) {
      Alert.alert(
        "Missing Photo",
        "Please take or select a photo for the encounter."
      );
      return;
    }

    // Create the encounter object
    const newEncounter = {
      date: new Date().toLocaleDateString(), // Current date
      location: location || "Unknown", // Location or default
      details: details || "No details provided", // Details or default
      photo: imageUri, // Photo URI
    };

    // Add the encounter to the cat and go back
    addEncounter(catId, newEncounter);
    navigation.goBack();
  };

  // Render the UI for adding an encounter
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Image picker button and preview */}
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
          {/* Location input field */}
          <TextInput
            style={styles.input}
            placeholder="Location of Encounter"
            placeholderTextColor="#7A5C3E"
            value={location}
            onChangeText={setLocation}
          />
          {/* Details input field */}
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Details of Encounter"
            placeholderTextColor="#7A5C3E"
            value={details}
            onChangeText={setDetails}
            multiline
          />
          {/* Save button */}
          <TouchableOpacity style={styles.button} onPress={handleSaveEncounter}>
            <Text style={styles.buttonText}>Save Encounter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}