// components/CatCard.js
// Card component for displaying a cat in the list/grid
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles";

// Props:
// - cat: the cat object to display
// - onPress: function to call when the card is pressed
export default function CatCard({ cat, onPress }) {
  return (
    // TouchableOpacity makes the card pressable
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Show the cat's image if available */}
      <Image
        source={cat.imageUri ? { uri: cat.imageUri } : null}
        style={styles.cardImage}
      />
      {/* Show the cat's name */}
      <Text style={styles.cardName}>{cat.name}</Text>
    </TouchableOpacity>
  );
}