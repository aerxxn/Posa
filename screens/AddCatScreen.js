//Add Cat Screen
// Allows user to add a new cat profile with its first encounter.

//IMPORTS
import CatInput from "../components/CatInput";
import React, { useState, useRef } from "react";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
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

  // Refs for input focus management
  const nameRef = useRef(null);
  const eyeRef = useRef(null);
  const colorRef = useRef(null);
  const behaviorRef = useRef(null);
  const locationRef = useRef(null);
  const detailsRef = useRef(null);

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

        // Persist the manipulated image into app storage and ensure it actually exists.
        let persistedUri;
        try {
          persistedUri = await saveImageToDest(manipulatedImage, dest);
          // Confirm the file exists
          const info = await FileSystem.getInfoAsync(persistedUri);
          if (!info.exists) {
            throw new Error('Persisted file not found after save: ' + persistedUri);
          }
        } catch (err) {
          console.error('Failed to persist manipulated image to app storage:', err, 'dest=', dest, 'manipulatedUri=', manipulatedImage.uri);
          Alert.alert('Save failed', 'Could not save the photo to persistent storage. Please try again.');
          return; // abort saving the cat to avoid storing a non-persistent uri
        }

        const initialEncounter = {
          id: Date.now(),
          date: new Date().toLocaleDateString(),
          location: location || "Unknown",
          details: details || "No details provided",
          photo: persistedUri,
          label: 1, // initial encounter label starts at 1
        };

        const newCat = {
          name,
          eye,
          color,
          behavior,
          imageUri: persistedUri,
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
            ref={nameRef}
            label="Name"
            placeholder="Enter cat's name"
            value={name}
            onChangeText={setName}
            returnKeyType="next"
            onSubmitEditing={() => eyeRef.current && eyeRef.current.focus && eyeRef.current.focus()}
            blurOnSubmit={false}
          />
          <CatInput
            ref={eyeRef}
            label="Eye Color"
            placeholder="Optional"
            value={eye}
            onChangeText={setEye}
            returnKeyType="next"
            onSubmitEditing={() => colorRef.current && colorRef.current.focus && colorRef.current.focus()}
            blurOnSubmit={false}
          />
          <CatInput
            ref={colorRef}
            label="Fur Color"
            placeholder="Optional"
            value={color}
            onChangeText={setColor}
            returnKeyType="next"
            onSubmitEditing={() => behaviorRef.current && behaviorRef.current.focus && behaviorRef.current.focus()}
            blurOnSubmit={false}
          />
          <CatInput
            ref={behaviorRef}
            label="Behavior / Personality"
            placeholder="Optional"
            value={behavior}
            onChangeText={setBehavior}
            returnKeyType="next"
            onSubmitEditing={() => locationRef.current && locationRef.current.focus && locationRef.current.focus()}
            blurOnSubmit={false}
          />


          {/*FIRST ENCOUNTER SECTION*/}
          <Text style={styles.subtitle}>First Encounter</Text>
          <CatInput
            ref={locationRef}
            style={styles.input}
            placeholder="Location of Encounter"
            placeholderTextColor="#7A5C3E"
            value={location}
            onChangeText={setLocation}
            returnKeyType="next"
            onSubmitEditing={() => detailsRef.current && detailsRef.current.focus && detailsRef.current.focus()}
            blurOnSubmit={false}
          />
          <CatInput
            ref={detailsRef}
            style={[styles.input, styles.detailsInput, styles.inputMultiline]}
            placeholder="Details of Encounter"
            placeholderTextColor="#7A5C3E"
            value={details}
            onChangeText={setDetails}
            multiline
            textAlignVertical="top"
            returnKeyType="done"
            onSubmitEditing={handleSaveCat}
            blurOnSubmit={true}
          />

          {/*SAVE BUTTON*/}
          <TouchableOpacity style={[styles.button]} onPress={handleSaveCat}>
            <Text style={styles.buttonText}>Save Cat</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
  );
}
