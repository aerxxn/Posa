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

//COMPONENT
export default function EncounterCard({ encounter, catId, onLongPress, encounterId, totalEncounters, displayIndex }) {
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
      { text: "Delete", onPress: () => deleteEncounter(catId, encounterId), style: "destructive" },
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
  const handleSaveEdit = () => {
    if (!editPhoto) {
      Alert.alert("Missing Photo", "Please select a photo for the encounter.");
      return;
    }

    updateEncounter(catId, encounterId, {
      ...encounter, 
      photo: editPhoto, 
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
      
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!res.canceled && res.assets?.[0]) {
        setEditPhoto(res.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  const encounterNumber = totalEncounters - displayIndex;

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
                style={{
                  fontWeight: "bold",
                  color: colors.primary,
                  fontSize: 15,
                  marginBottom: 2,
                }}
              >
                {`Encounter #${encounterNumber ?? 0}`}
              </Text>

              <Text
                style={[styles.encounterDate, { textAlign: "center", width: "100%" }]}
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
            <Text style={[styles.encounterDetail, { marginTop: 12 }]}>
              {encounter.details || "No details provided"}
            </Text>
          )}
        </View>

        {/*BUTTONS (EXPANDED)*/}
        {isExpanded && (
          <View style={styles.encounterActionButtons}>
            <TouchableOpacity onPress={handleDelete} style={{ padding: 5 }}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={{ padding: 5 }}>
              <Ionicons name="create-outline" size={24} color={colors.text} />
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
