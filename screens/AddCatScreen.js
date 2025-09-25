// screens/AddCatScreen.js
// Screen for adding a new cat to the collection
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

export default function AddCatScreen({ navigation, route }) {
  // Get imageSource from navigation route params
  const { imageSource } = route.params || {};
  // State for cat attributes
  const [name, setName] = useState("");
  const [eye, setEye] = useState("");
  const [color, setColor] = useState("");
  const [behavior, setBehavior] = useState("");
  const [imageUri, setImageUri] = useState(null);
  // State for first encounter details
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  // Get addCat function from context
  const { addCat } = useCats();

  // Request permissions and handle image picking based on source
  useEffect(() => {
    (async () => {
      // Request camera and gallery permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== 'granted' || galleryStatus !== 'granted') {
        Alert.alert(
          "Permission Required",
          "Camera and media library permissions are needed to add cat photos."
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

  // Handles saving the new cat
  const handleSaveCat = () => {
    // Require a name and photo before saving
    if (!name || !imageUri) {
      Alert.alert(
        "Missing Info",
        "Please enter the cat's name and select a profile picture."
      );
      return;
    }

    // Create the new cat object
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

    // Add the cat and go back
    addCat(newCat, () => {
      navigation.goBack();
    });
  };

  // Render the UI for adding a cat
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>New Cat Acquired!</Text>
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
          {/* Cat name input */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#7A5C3E"
            value={name}
            onChangeText={setName}
          />
          {/* Eye color input */}
          <TextInput
            style={styles.input}
            placeholder="Eye Color (optional)"
            placeholderTextColor="#7A5C3E"
            value={eye}
            onChangeText={setEye}
          />
          {/* Fur color input */}
          <TextInput
            style={styles.input}
            placeholder="Fur Color (optional)"
            placeholderTextColor="#7A5C3E"
            value={color}
            onChangeText={setColor}
          />
          {/* Behavior input */}
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Behavior/Personality (optional)"
            placeholderTextColor="#7A5C3E"
            value={behavior}
            onChangeText={setBehavior}
            multiline
          />
          {/* First encounter section */}
          <Text style={styles.subtitle}>First Encounter</Text>
          {/* Location input */}
          <TextInput
            style={styles.input}
            placeholder="Location of Encounter"
            placeholderTextColor="#7A5C3E"
            value={location}
            onChangeText={setLocation}
          />
          {/* Details input */}
          <TextInput
            style={[styles.input, styles.detailsInput]}
            placeholder="Details of Encounter"
            placeholderTextColor="#7A5C3E"
            value={details}
            onChangeText={setDetails}
            multiline
            textAlignVertical="top"
          />

          {/* Save button */}
          <TouchableOpacity style={styles.button} onPress={handleSaveCat}>
            <Text style={styles.buttonText}>Save Cat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}