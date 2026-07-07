import CatInput from "../components/CatInput";
import AttributePicker from "../components/AttributePicker";
import { BEHAVIOR_OPTIONS, EYE_COLOR_OPTIONS, FUR_COLOR_OPTIONS } from "../utils/catAttributes";
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
              onSubmitEditing={() => eyeRef.current && eyeRef.current.open && eyeRef.current.open()}
              blurOnSubmit={false}
            />
            <View style={styles.attributeRow}>
              <AttributePicker
                ref={eyeRef}
                label="Eye Color"
                title="Select eye colors"
                placeholder="Select up to 2 colors"
                value={eye}
                onChange={(t) => setEditableCat((p) => ({ ...p, eye: t }))}
                options={EYE_COLOR_OPTIONS}
                maxSelections={2}
                containerStyle={styles.attributeColumn}
              />
              <AttributePicker
                ref={colorRef}
                label="Fur Color"
                title="Select fur colors"
                placeholder="Select up to 3 colors"
                value={color}
                onChange={(t) => setEditableCat((p) => ({ ...p, color: t }))}
                options={FUR_COLOR_OPTIONS}
                maxSelections={3}
                containerStyle={styles.attributeColumn}
              />
            </View>
            <AttributePicker
              ref={behaviorRef}
              label="Behavior / Personality"
              title="Select behavior"
              placeholder="Choose 1 behavior"
              value={behavior}
              onChange={(t) => setEditableCat((p) => ({ ...p, behavior: t }))}
              options={BEHAVIOR_OPTIONS}
              maxSelections={1}
              showSwatches={false}
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
