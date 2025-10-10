import React from "react";
import { TouchableOpacity, Text } from "react-native";
import styles from "../styles";

export default function FabButton({
  icon = "+",
  onPress,
  position = { bottom: 40, right: 20 },
  style,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fab,
        position,
        { zIndex: 20, elevation: 20 },
        style, // optional extra styles
      ]}
    >
      <Text style={styles.fabText}>{icon}</Text>
    </TouchableOpacity>
  );
}
