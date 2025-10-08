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
  Dimensions,
} from "react-native";
import { useCats } from "../CatContext";
import styles, { colors } from "../styles";
import * as ImagePicker from "expo-image-picker";

export default function AddEncounterScreen({ navigation, route }) {
  // Accept pre-selected imageUri (if any) and catId from navigation params
  const { catId, catName, imageUri: initialImageUri } = route.params || {};
  const { addEncounter } = useCats();

  // Start state with the preselected URI if provided
  const [imageUri, setImageUri] = useState(initialImageUri || null);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  // Get screen width for square image
  const screenWidth = Dimensions.get("window").width;

  // Ask for permissions on mount (but DO NOT auto-open pickers here)
  useEffect(() => {
    (async () => {
      try {
        await ImagePicker.requestCameraPermissionsAsync();
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (e) {
        console.warn("Permission request failed:", e);
      }
    })();
  }, []);

  // Opens the image library for user to pick/change a photo (manual)
  const handleImagePicker = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!res.canceled && res.assets?.[0]) {
        setImageUri(res.assets[0].uri);
      }
    } catch (e) {
      console.error("launchImageLibraryAsync error:", e);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  // Opens the camera for user to take/change a photo (manual)
  const handleCameraPicker = async () => {
    try {
      const res = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!res.canceled && res.assets?.[0]) {
        setImageUri(res.assets[0].uri);
      }
    } catch (e) {
      console.error("launchCameraAsync error:", e);
      Alert.alert("Error", "Failed to open camera.");
    }
  };

  // Save the new encounter
  const handleSaveEncounter = () => {
    if (!imageUri) {
      Alert.alert("Missing Photo", "Please take or select a photo for the encounter.");
      return;
    }

    const newEncounter = {
      id: Date.now(), // Unique ID for the encounter
      date: new Date().toLocaleDateString(),
      location: location || "Unknown",
      details: details || "No details provided",
      photo: imageUri,
    };

    addEncounter(catId, newEncounter);
    navigation.goBack();
  };

  return (
      <ScrollView 
      contentContainerStyle={[styles.scrollContainer, {flexGrow: 1}]}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor: colors.background }}>
        <View style={styles.container}>
      
          {/* Image preview area — displays preselected image above inputs */}
          <TouchableOpacity
            onPress={handleImagePicker}
            onLongPress={handleCameraPicker}
            style={{ alignItems: "center", marginVertical: 12 }}
          >
            {imageUri ? (
              // Show the chosen image as a square
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: screenWidth - 40, // some padding from sides
                  height: screenWidth - 40, // square
                  borderRadius: 12,
                  resizeMode: "cover",
                }}
              />
            ) : (
              // Placeholder container
              <View style={[styles.imageInputContainer, { justifyContent: "center" }]}>
                <Text style={styles.imagePlaceholderText}>
                  Tap to add photo (long press for camera)
                </Text>
              </View>
            )}
          </TouchableOpacity>

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
            style={[styles.input, styles.inputMultiline]}
            placeholder="Details of Encounter"
            placeholderTextColor="#7A5C3E"
            value={details}
            onChangeText={setDetails}
            multiline
            textAlignVertical="top"
          />

          {/* Save button */}
          <TouchableOpacity style={styles.button} onPress={handleSaveEncounter}>
            <Text style={styles.buttonText}>Save Encounter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
  );
}
