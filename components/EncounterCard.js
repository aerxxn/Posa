//ENCOUNTER CARD
// Displays an encounter summary card with photo, details, and edit/delete options.

//IMPORTS
import EditEncounterModal from "../components/EditEncounterModal";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert
} from "react-native";
import styles, { colors } from "../styles";
import { useCats } from "../CatContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { safeLaunchImageLibraryAsync } from "../utils/safeImagePicker";
import { moderateScale, verticalScale } from '../scaling';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { saveImageToDest } from '../utils/fileUtils';

//COMPONENT
export default function EncounterCard({ encounter, catId, onLongPress, encounterId }) {
  const { deleteEncounter, updateEncounter } = useCats();

  //STATE
  const [isExpanded, setIsExpanded] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPhoto, setEditPhoto] = useState(encounter.photo);
  const [editLocation, setEditLocation] = useState(encounter.location || "");
  const [editDetails, setEditDetails] = useState(encounter.details || "");

  //HANDLERS: DELETE ENCOUNTER
  const handleDelete = () => {
    Alert.alert("Delete Encounter", "Are you sure you want to delete this encounter?", [
      { text: "Cancel", style: "cancel" },
      // The catId and encounterId are correctly sourced from props here
      { text: "Delete", onPress: async () => { await deleteEncounter(catId, encounterId); }, style: "destructive" },
    ]);
  };

  //HANDLERS: EDIT ENCOUNTER
  const handleEdit = () => {
    // Re-initialize state when opening modal to ensure fresh data
    setEditPhoto(encounter.photo);
    setEditLocation(encounter.location || "");
    setEditDetails(encounter.details || "");
    setEditModalVisible(true);
  };

  //HANDLERS: SAVE EDIT
  const handleSaveEdit = async () => {
    if (!editPhoto) {
      Alert.alert("Missing Photo", "Please select a photo for the encounter.");
      return;
    }

    let finalPhoto = editPhoto;
    try {
      if (!finalPhoto.startsWith(FileSystem.documentDirectory)) {
        // Resize/compress and persist into app documentDirectory
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          finalPhoto,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
        if (!baseDir) {
          throw new Error('No FileSystem.documentDirectory or cacheDirectory available');
        }
        const ensureDir = `${baseDir}posa_images/`;
        try { await FileSystem.makeDirectoryAsync(ensureDir, { intermediates: true }); } catch (e) { /* ignore */ }

        const extMatch = manipulatedImage.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        const ext = extMatch ? extMatch[1] : "jpg";
        const dest = `${ensureDir}${Date.now()}.${ext}`;

        try {
          const persisted = await saveImageToDest(manipulatedImage, dest);
          finalPhoto = persisted;
        } catch (e) {
          console.error('Failed to persist edited encounter image, saving original uri instead', e);
        }
      }
    } catch (e) {
      console.error('Error while processing edited encounter image:', e);
    }

    await updateEncounter(catId, encounterId, {
      ...encounter,
      photo: finalPhoto,
      location: editLocation,
      details: editDetails,
    });

    setEditModalVisible(false);
  };

  //IMAGE PICKER FOR EDITING
  const handleEditImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Gallery access is needed to pick a photo.');
        return;
      }
      
  const libOptions = { quality: 1 };
  const res = await safeLaunchImageLibraryAsync(libOptions);
      if (!res.canceled && res.assets?.[0]) {
        setEditPhoto(res.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  //RENDER: MAIN CARD & MODAL
  return (
    <>
      {/* Main Encounter Card */}
      <TouchableOpacity
        style={styles.encounterCard}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={{ flexDirection: "column", flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={onLongPress}>
              <Image source={{ uri: encounter.photo }} style={styles.encounterImage} />
            </TouchableOpacity>
            <View
              style={[
                styles.encounterInfo,
                { flex: 1, justifyContent: "center", alignItems: "center" },
              ]}
            >
              <Text
                style={[
                  styles.encounterDate,
                  { textAlign: "center", width: "100%", fontWeight: "bold", fontSize: moderateScale(16) },
                ]}
              >
                {encounter.date}
              </Text>

              <Text
                style={[styles.encounterLocation, { textAlign: "center", width: "100%" }]}
              >
                {encounter.location || "Unknown location"}
              </Text>
            </View>
          </View>

          {/*DETAILS (EXPANDED)*/}
          {isExpanded && (
            <Text style={[styles.encounterDetail, { marginTop: verticalScale(12) }]}>
              {encounter.details || "No details provided"}
            </Text>
          )}
        </View>

        {/*BUTTONS (EXPANDED)*/}
        {isExpanded && (
          <View style={styles.encounterActionButtons}>
            <TouchableOpacity onPress={handleDelete} style={{ padding: moderateScale(5) }}>
              <Ionicons name="trash-outline" size={moderateScale(24)} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={{ padding: moderateScale(5) }}>
              <Ionicons name="create-outline" size={moderateScale(24)} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/*EDIT MODAL*/}
      <EditEncounterModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
        editData={{
          photo: editPhoto,
          location: editLocation,
          details: editDetails,
        }}
        setEditData={(updater) => {
          const next =
            typeof updater === "function"
              ? updater({
                  photo: editPhoto,
                  location: editLocation,
                  details: editDetails,
                })
              : updater;

          setEditPhoto(next.photo);
          setEditLocation(next.location);
          setEditDetails(next.details);
        }}
        handleImagePicker={handleEditImagePicker}
      />
    </>
  );
}
