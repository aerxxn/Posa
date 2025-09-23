// components/EncounterCard.js
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert, Pressable } from "react-native";
import styles, { colors } from "../styles";
import { useCats } from "../CatContext";
import { Ionicons } from '@expo/vector-icons';

export default function EncounterCard({ encounter, catId, onLongPress, encounterIndex }) {
  const { deleteEncounter } = useCats();
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleEdit = () => {
    Alert.alert("Edit", "Edit encounter feature not yet implemented.");
  };

  return (
    <TouchableOpacity
      style={styles.encounterCard}
      onPress={() => setIsExpanded(!isExpanded)}
    >
      <Pressable onPress={onLongPress}>
        <Image
          source={{ uri: encounter.photo }}
          style={styles.encounterImage}
        />
      </Pressable>

      <View style={styles.encounterInfo}>
        {isExpanded ? (
          // The truncation props are removed here
          <Text style={styles.encounterDetail}>
            {encounter.details || "No details provided"}
          </Text>
        ) : (
          <>
            <Text style={styles.encounterDate}>
              {encounter.date}
            </Text>
            <Text style={styles.encounterLocation}>
              {encounter.location || "Unknown location"}
            </Text>
          </>
        )}
      </View>

      {isExpanded && (
        <View style={styles.encounterActionButtons}>
          <TouchableOpacity onPress={handleEdit} style={{ padding: 5, marginRight: 10 }}>
            <Ionicons name="create-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={{ padding: 5 }}>
            <Ionicons name="trash-outline" size={24} color={colors.danger} />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}