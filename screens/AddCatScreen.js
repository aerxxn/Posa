//Add Cat Screen
// Allows user to add a new cat profile with its first encounter.

//IMPORTS
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
  const handleSaveCat = () => {
    if (!name || !imageUri) {
      Alert.alert("Missing Info", "Please enter the cat's name and select a photo.");
      return;
    }

    const newCat = {
      name,
      eye,
      color,
      behavior,
      imageUri,
      encounters: [
        {
          id: Date.now(), // Unique ID for the encounter
          date: new Date().toLocaleDateString(),
          location: location || "Unknown",
          details: details || "No details provided",
          photo: imageUri,
        },
      ],
    };

    addCat(newCat, () => navigation.goBack());
  };

  //RENDER
  return (
      <ScrollView 
      contentContainerStyle={[styles.scrollContainer,{ flexGrow: 1 }]}
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
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#7A5C3E"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Eye Color (optional)"
            placeholderTextColor="#7A5C3E"
            value={eye}
            onChangeText={setEye}
          />
          <TextInput
            style={styles.input}
            placeholder="Fur Color (optional)"
            placeholderTextColor="#7A5C3E"
            value={color}
            onChangeText={setColor}
          />
          <TextInput
            style={[styles.input]}
            placeholder="Behavior/Personality (optional)"
            placeholderTextColor="#7A5C3E"
            value={behavior}
            onChangeText={setBehavior}
            multiline
          />

          {/*FIRST ENCOUNTER SECTION*/}
          <Text style={styles.subtitle}>First Encounter</Text>
          <TextInput
            style={styles.input}
            placeholder="Location of Encounter"
            placeholderTextColor="#7A5C3E"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={[styles.input, styles.detailsInput, styles.inputMultiline]}
            placeholder="Details of Encounter"
            placeholderTextColor="#7A5C3E"
            value={details}
            onChangeText={setDetails}
            multiline
            textAlignVertical="top"
          />

          {/*SAVE BUTTON*/}
          <TouchableOpacity style={styles.button} onPress={handleSaveCat}>
            <Text style={styles.buttonText}>Save Cat</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
  );
}
