// screens/AddEncounterScreen.js
import CatInput from "../components/CatInput";
import PhotoPicker from "../components/PhotoPicker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
import { saveImageToDest } from "../utils/fileUtils";
import React, { useState} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { useCats } from "../CatContext";
import styles from "../styles";

export default function AddEncounterScreen({ navigation, route }) {
  // Accept pre-selected imageUri (if any) and catId from navigation params
  const { catId, catName, imageUri: initialImageUri } = route.params || {};
  const { addEncounter } = useCats();

  // Start state with the preselected URI if provided
  const [imageUri, setImageUri] = useState(initialImageUri || null);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");

  // Save the new encounter
  const handleSaveEncounter = async () => {
    if (!imageUri) {
      Alert.alert("Missing Photo", "Please take or select a photo for the encounter.");
      return;
    }

    try {
      // 🔧 Resize & compress before saving
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // keeps aspect ratio automatically
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

  // Persist the manipulated image to the app's documentDirectory so it survives restarts
  const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
  if (!baseDir) console.error('No FileSystem.documentDirectory or cacheDirectory available');
  const ensureDir = `${baseDir}posa_images/`;
      try {
        await FileSystem.makeDirectoryAsync(ensureDir, { intermediates: true });
      } catch (e) {
        // ignore
      }

      const extMatch = manipulatedImage.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
      const ext = extMatch ? extMatch[1] : "jpg";
      const dest = `${ensureDir}${Date.now()}.${ext}`;
      try {
        await saveImageToDest(manipulatedImage, dest);
      } catch (err) {
        console.error('Failed to persist encounter image to app storage:', err, 'dest=', dest, 'manipulatedUri=', manipulatedImage.uri);
      }

      const newEncounter = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        location: location || "Unknown",
        details: details || "No details provided",
        photo: dest || manipulatedImage.uri, // use persisted photo when possible
      };

      addEncounter(catId, newEncounter);
      navigation.goBack();
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Something went wrong while processing the image.");
    }
  };


  return (
      <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      style={[styles.backgroundScreen]}>
        <View style={styles.container}>
          {/* Image preview area — displays preselected image above inputs */}
          <PhotoPicker
            label="Encounter Photo"
            imageUri={imageUri}
            onChange={setImageUri}
          />

          {/* Location input */}
          <CatInput
            style={styles.input}
            placeholder="Location of Encounter"
            placeholderTextColor="#7A5C3E"
            value={location}
            onChangeText={setLocation}
          />

          {/* Details input */}
          <CatInput
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
