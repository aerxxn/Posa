import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HelpModal({ visible, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            width: "85%",
            maxHeight: "80%",
          }}
        >
          {/* Close Button */}
          <TouchableOpacity
            style={{ position: "absolute", top: 12, right: 12 }}
            onPress={onClose}
          >
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>

          {/* Scrollable Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                marginBottom: 8,
                textAlign: "center",
              }}
            >
              How to Use Posa
            </Text>

            {/* Home Screen Instructions */}
            <Text
              style={{ fontSize: 14, marginBottom: 15, lineHeight: 22 }}
            >
              <Text style={{ fontWeight: "bold" }}>Home:</Text> View all your
              known cats here. Tap the{" "}
              <Text style={{ fontWeight: "bold" }}>+</Text> button (bottom
              right) to open options to add a new cat. Choose 📷 to take a photo
              or 🖼️ to pick from your gallery.
            </Text>

            {/* Cat Detail Screen Instructions */}
            <Text
              style={{ fontSize: 14, marginBottom: 15, lineHeight: 22 }}
            >
              <Text style={{ fontWeight: "bold" }}>Cat Detail:</Text> Tap on a
              cat's card to see its profile and a history of encounters. To{" "}
              <Text style={{ fontWeight: "bold" }}>add a new encounter</Text>,
              tap the <Text style={{ fontWeight: "bold" }}>+</Text> button
              (bottom right) and select a photo source. To{" "}
              <Text style={{ fontWeight: "bold" }}>edit the cat's profile</Text>{" "}
              or <Text style={{ fontWeight: "bold" }}>delete the cat</Text>, use
              the pencil (✏️) and trash (🗑️) icons next to the cat's name.
            </Text>

            {/* Encounters Instructions */}
            <Text
              style={{ fontSize: 14, marginBottom: 10, lineHeight: 22 }}
            >
              <Text style={{ fontWeight: "bold" }}>Encounters:</Text> Tap on an
              encounter card to expand and view its full details. When expanded,
              you will see options to{" "}
              <Text style={{ fontWeight: "bold" }}>edit</Text> (✏️) or{" "}
              <Text style={{ fontWeight: "bold" }}>delete</Text> (🗑️) the
              specific encounter. You can tap the encounter photo to view it
              fullscreen.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
