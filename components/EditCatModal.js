import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "../styles";

export default function EditCatModal({
  visible,
  onClose,
  onSave,
  editableCat,
  setEditableCat,
  handleImagePicker,
}) {
  const { name, eye, color, behavior, imageUri } = editableCat;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.modalBackground}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Edit Cat</Text>

            {/* Image picker */}
            <TouchableOpacity onPress={handleImagePicker}>
              <Image source={{ uri: imageUri }} style={styles.modalImage} />
              <Text style={styles.modalChangePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            {/* Inputs */}
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, name: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Eye Color"
              value={eye}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, eye: t }))}
            />
            <TextInput
              style={styles.input}
              placeholder="Fur Color"
              value={color}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, color: t }))}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Behavior"
              value={behavior}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, behavior: t }))}
              multiline
            />

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#aaa", flex: 1, marginRight: 10 }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
