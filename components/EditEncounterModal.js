import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import styles, { colors } from "../styles";
import CatInput from "./CatInput";

export default function EditEncounterModal({
  visible,
  onClose,
  onSave,
  editData,
  setEditData,
  handleImagePicker,
}) {
  const { photo, location, details } = editData;

  const locationRef = useRef(null);
  const detailsRef = useRef(null);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={100}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Edit Encounter</Text>

            {/* --- PHOTO PICKER --- */}
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{ alignItems: "center", marginVertical: 10 }}
            >
              <Image source={{ uri: photo }} style={styles.modalImage} />
              <Text style={styles.modalChangePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            {/* --- INPUTS --- */}
            <CatInput
              ref={locationRef}
              style={styles.input}
              placeholder="Location"
              placeholderTextColor="#7A5C3E"
              value={location}
              onChangeText={(t) => setEditData((p) => ({ ...p, location: t }))}
              returnKeyType="next"
              onSubmitEditing={() => detailsRef.current && detailsRef.current.focus && detailsRef.current.focus()}
              blurOnSubmit={false}
            />

            <CatInput
              ref={detailsRef}
              style={[styles.input, styles.inputMultiline]}
              placeholder="Details"
              placeholderTextColor="#7A5C3E"
              value={details}
              onChangeText={(t) => setEditData((p) => ({ ...p, details: t }))}
              multiline
              returnKeyType="done"
              onSubmitEditing={onSave}
              blurOnSubmit={true}
            />

            {/* --- BUTTONS --- */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: colors.cancel, flex: 1, marginRight: 10 },
                ]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { flex: 1 }]}
                onPress={onSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
