// components/EncounterCard.js
// Card component for displaying a single encounter of a cat
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert, Pressable, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import styles, { colors } from "../styles";
import { useCats } from "../CatContext";
import { Ionicons } from '@expo/vector-icons';

// Props:
// - encounter: the encounter object to display
// - catId: the id of the cat this encounter belongs to
// - onLongPress: function to call when the image is long-pressed
// - encounterIndex: index of the encounter in the cat's encounter list
export default function EncounterCard({ encounter, catId, onLongPress, encounterIndex }) {
  // Get deleteEncounter function from context
  const { deleteEncounter, updateEncounter } = useCats();
  // State to toggle expanded/collapsed view
  const [isExpanded, setIsExpanded] = useState(false);
  // State for edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  // Editable encounter fields
  const [editPhoto, setEditPhoto] = useState(encounter.photo);
  const [editLocation, setEditLocation] = useState(encounter.location || "");
  const [editDetails, setEditDetails] = useState(encounter.details || "");

  // Handle deleting this encounter
  const handleDelete = () => {
    Alert.alert(
      "Delete Encounter",
      "Are you sure you want to delete this encounter?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteEncounter(catId, encounterIndex),
          style: "destructive",
        },
      ]
    );
  };

  // Open the edit modal
  const handleEdit = () => {
    setEditPhoto(encounter.photo);
    setEditLocation(encounter.location || "");
    setEditDetails(encounter.details || "");
    setEditModalVisible(true);
  };

  // Save the edited encounter
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

  // Image picker for editing photo
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
      {/* TouchableOpacity toggles expanded/collapsed state */}
      <TouchableOpacity
        style={styles.encounterCard}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Pressable image for long-press actions (e.g., fullscreen) */}
            <Pressable onPress={onLongPress}>
              <Image
                source={{ uri: encounter.photo }}
                style={styles.encounterImage}
              />
            </Pressable>
            <View style={[styles.encounterInfo, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}> 
              <Text style={{ fontWeight: 'bold', color: colors.primary, fontSize: 15, marginBottom: 2 }}>{`Encounter #${(encounterIndex ?? 0) + 1}`}</Text>
              <Text style={[styles.encounterDate, { textAlign: 'center', width: '100%' }]}>{encounter.date}</Text>
              <Text style={[styles.encounterLocation, { textAlign: 'center', width: '100%' }]}>{encounter.location || "Unknown location"}</Text>
            </View>
          </View>
          {isExpanded && (
            <Text style={[styles.encounterDetail, { marginTop: 12 }]}> {/* Details always at bottom */}
              {encounter.details || "No details provided"}
            </Text>
          )}
        </View>

        {/* Show edit/delete buttons if expanded */}
        {isExpanded && (
          <View style={styles.encounterActionButtons}>
            <TouchableOpacity onPress={handleDelete} style={{ padding: 5, marginBottom: 8 }}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit} style={{ padding: 5 }}>
              <Ionicons name="create-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>

      {/* Edit Encounter Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView contentContainerStyle={styles.modalCard}>
            <Text style={styles.title}>Edit Encounter</Text>
            <TouchableOpacity onPress={handleEditImagePicker}>
              <Image
                source={{ uri: editPhoto }}
                style={styles.modalImage}
              />
              <Text style={styles.modalChangePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#7A5C3E"
              value={editLocation}
              onChangeText={setEditLocation}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Details"
              placeholderTextColor="#7A5C3E"
              value={editDetails}
              onChangeText={setEditDetails}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#aaa', flex: 1, marginRight: 10 }]}
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
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}