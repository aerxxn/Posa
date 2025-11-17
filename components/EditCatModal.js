import CatInput from "../components/CatInput";
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
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

  const nameRef = useRef(null);
  const eyeRef = useRef(null);
  const colorRef = useRef(null);
  const behaviorRef = useRef(null);

  // When modal opens, focus first field (name) for convenience
  useEffect(() => {
    if (visible && nameRef.current && nameRef.current.focus) {
      setTimeout(() => nameRef.current.focus(), 50);
    }
  }, [visible]);

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
            <CatInput
              ref={nameRef}
              style={styles.input}
              label="Name"
              placeholder="Name"
              value={name}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, name: t }))}
              returnKeyType="next"
              onSubmitEditing={() => eyeRef.current && eyeRef.current.focus && eyeRef.current.focus()}
              blurOnSubmit={false}
            />
            <CatInput
              ref={eyeRef}
              style={styles.input}
              label="Eye Color"
              placeholder="Eye Color"
              value={eye}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, eye: t }))}
              returnKeyType="next"
              onSubmitEditing={() => colorRef.current && colorRef.current.focus && colorRef.current.focus()}
              blurOnSubmit={false}
            />
            <CatInput
              ref={colorRef}
              style={styles.input}
              label="Fur"
              placeholder="Fur Color"
              value={color}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, color: t }))}
              returnKeyType="next"
              onSubmitEditing={() => behaviorRef.current && behaviorRef.current.focus && behaviorRef.current.focus()}
              blurOnSubmit={false}
            />
            <CatInput
              ref={behaviorRef}
              style={[styles.input, styles.inputMultiline]}
              label="Behavior / Personality"
              placeholder="Behavior"
              value={behavior}
              onChangeText={(t) => setEditableCat((p) => ({ ...p, behavior: t }))}
              multiline
              returnKeyType="done"
              onSubmitEditing={onSave}
              blurOnSubmit={true}
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
