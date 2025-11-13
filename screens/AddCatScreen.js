//Add Cat Screen
// Allows user to add a new cat profile with its first encounter.

//IMPORTS
import CatInput from "../components/CatInput";
import React, { useState } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system";
import { saveImageToDest } from "../utils/fileUtils";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { useCats } from "../CatContext";
import styles from "../styles";

//COMPONENT
export default function AddCatScreen({ navigation, route }) {
  //STATE & CONTEXT
  const { imageUri: initialImageUri } = route.params || {};
  const [imageUri] = useState(initialImageUri || null);
  const [name, setName] = useState("");
  const [eye, setEye] = useState("");
  const [color, setColor] = useState("");
  const [behavior, setBehavior] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const { addCat } = useCats();

  //HANDLERS: SAVE CAT
  const handleSaveCat = async () => {
    if (!name || !imageUri) {
      Alert.alert("Missing Info", "Please enter the cat's name and select a photo.");
      return;
    }

    try {
      // 🔧 Resize and compress image before saving
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }], // resize to width 800px, preserving aspect ratio
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

        // Copy the manipulated image into the app's document directory so it persists across restarts
        const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
        if (!baseDir) console.error('No FileSystem.documentDirectory or cacheDirectory available');
        const ensureDir = `${baseDir}posa_images/`;
        try {
          await FileSystem.makeDirectoryAsync(ensureDir, { intermediates: true });
        } catch (e) {
          // ignore if it already exists or creation failed for a benign reason
        }

        // Build a unique filename and copy the file
        const extMatch = manipulatedImage.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        const ext = extMatch ? extMatch[1] : "jpg";
        const dest = `${ensureDir}${Date.now()}.${ext}`;

        try {
          await saveImageToDest(manipulatedImage, dest);
        } catch (err) {
          console.error('Failed to persist manipulated image to app storage:', err, 'dest=', dest, 'manipulatedUri=', manipulatedImage.uri);
        }

        const initialEncounter = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          location: location || "Unknown",
          details: details || "No details provided",
          photo: dest || manipulatedImage.uri,
          label: 1, // initial encounter label starts at 1
        };

        const newCat = {
          name,
          eye,
          color,
          behavior,
          imageUri: dest || manipulatedImage.uri,
          encounters: [initialEncounter],
          nextEncounterNumber: 2, // next encounter will get label 2
        };

        addCat(newCat, () => navigation.goBack());
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Something went wrong while processing the image.");
    }
  };


  //RENDER
  return (
      <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/*CAT PHOTO PREVIEW*/}
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 12,
                marginBottom: 20,
                alignSelf: "center",
              }}
            />
          ) : (
            <Text style={styles.subtitle}>No image selected</Text>
          )}

          {/*INPUTS*/}
          <CatInput
            label="Name"
            placeholder="Enter cat's name"
            value={name}
            onChangeText={setName}
          />
          <CatInput
            label="Eye Color"
            placeholder="Optional"
            value={eye}
            onChangeText={setEye}
          />
          <CatInput
            label="Fur Color"
            placeholder="Optional"
            value={color}
            onChangeText={setColor}
          />
          <CatInput
            label="Behavior / Personality"
            placeholder="Optional"
            value={behavior}
            onChangeText={setBehavior}
          />


          {/*FIRST ENCOUNTER SECTION*/}
          <Text style={styles.subtitle}>First Encounter</Text>
          <CatInput
            style={styles.input}
            placeholder="Location of Encounter"
            placeholderTextColor="#7A5C3E"
            value={location}
            onChangeText={setLocation}
          />
          <CatInput
            style={[styles.input, styles.detailsInput, styles.inputMultiline]}
            placeholder="Details of Encounter"
            placeholderTextColor="#7A5C3E"
            value={details}
            onChangeText={setDetails}
            multiline
            textAlignVertical="top"
          />

          {/*SAVE BUTTON*/}
          <TouchableOpacity style={[styles.button]} onPress={handleSaveCat}>
            <Text style={styles.buttonText}>Save Cat</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
  );
}
