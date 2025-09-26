// components/EncounterCard.js
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles, { colors } from "../styles";
import { useCats } from "../CatContext";
import { Ionicons } from "@expo/vector-icons";

export default function EncounterCard({ encounter, catId, onLongPress, encounterIndex }) {
  const { deleteEncounter, updateEncounter } = useCats();
  const [isExpanded, setIsExpanded] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPhoto, setEditPhoto] = useState(encounter.photo);
  const [editLocation, setEditLocation] = useState(encounter.location || "");
  const [editDetails, setEditDetails] = useState(encounter.details || "");

  const handleDelete = () => {
    Alert.alert("Delete Encounter", "Are you sure you want to delete this encounter?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => deleteEncounter(catId, encounterIndex), style: "destructive" },
    ]);
  };

  const handleEdit = () => {
    setEditPhoto(encounter.photo);
    setEditLocation(encounter.location || "");
    setEditDetails(encounter.details || "");
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editPhoto) {
      Alert.alert("Missing Photo", "Please select a photo for the encounter.");
      return;
    }
    updateEncounter(catId, encounterIndex, {
      ...encounter,
      photo: editPhoto,
      location: editLocation,
      details: editDetails,
    });
    setEditModalVisible(false);
  };

  const handleEditImagePicker = async () => {
    try {
      const ImagePicker = await import("expo-image-picker");
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!res.canceled && res.assets?.[0]) {
        setEditPhoto(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

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
                {`Encounter #${(encounterIndex ?? 0) + 1}`}
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
          {isExpanded && (
            <Text style={[styles.encounterDetail, { marginTop: 12 }]}>
              {encounter.details || "No details provided"}
            </Text>
          )}
        </View>

        {/* Buttons shown when expanded */}
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

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            style={styles.modalBackground}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Edit Encounter</Text>

              {/* Photo */}
              <TouchableOpacity
                onPress={handleEditImagePicker}
                style={{ alignItems: "center", marginVertical: 10 }}
              >
                <Image source={{ uri: editPhoto }} style={styles.modalImage} />
                <Text style={styles.modalChangePhotoText}>Change Photo</Text>
              </TouchableOpacity>

              {/* Location input */}
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#7A5C3E"
                value={editLocation}
                onChangeText={setEditLocation}
              />

              {/* Details input */}
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Details"
                placeholderTextColor="#7A5C3E"
                value={editDetails}
                onChangeText={setEditDetails}
                multiline
              />

              {/* Buttons */}
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#aaa", flex: 1, marginRight: 10 }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { flex: 1 }]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}
