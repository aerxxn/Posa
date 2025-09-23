// components/CatCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles";

export default function CatCard({ cat, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={cat.imageUri ? { uri: cat.imageUri } : null}
        style={styles.cardImage}
      />
      <Text style={styles.cardName}>{cat.name}</Text>
    </TouchableOpacity>
  );
}