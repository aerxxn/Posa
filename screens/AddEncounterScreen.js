// screens/AddEncounterScreen.js
import CatInput from "../components/CatInput";
import PhotoPicker from "../components/PhotoPicker";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import { useCats } from "../CatContext";
import styles, { colors } from "../styles";

export default function AddEncounterScreen({ navigation, route }) {
  // Accept pre-selected imageUri (if any) and catId from navigation params
  const { catId, catName, imageUri: initialImageUri } = route.params || {};
  const { addEncounter } = useCats();

  // Start state with the preselected URI if provided
  const [imageUri, setImageUri] = useState(initialImageUri || null);
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");


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
