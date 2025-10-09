// components/CatInput.js
import React from "react";
import { TextInput, View, Text } from "react-native";
import styles from "../styles";

/**
 * Reusable text input component for cat-related forms.
 *
 * Props:
 * - label: optional field title
 * - placeholder: placeholder text
 * - value: current input value
 * - onChangeText: handler to update value
 * - multiline: allows multiline input
 * - style: optional extra styling
 */
export default function CatInput({
  label,
  placeholder,
  value,
  onChangeText,
  multiline = false,
  style,
}) {
  return (
    <View style={{ width: "100%" }}>
      {label && (
        <Text
          style={{
            fontWeight: "bold",
            color: "#7A5C3E",
            marginBottom: 4,
            fontSize: 14,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          { textAlignVertical: multiline ? "top" : "center" },
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#7A5C3E"
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
}
