// screens/HomeScreen.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal ,ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCats } from "../CatContext";
import CatCard from "../components/CatCard";
import styles from "../styles";

import { useEffect } from "react";

export default function HomeScreen({ navigation, route }) {
  const { cats, loading, error } = useCats(); 
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  useEffect(() => {
    if (route?.params?.showHelp) {
      setHelpModalVisible(true);
      navigation.setParams({ showHelp: false });
    }
  }, [route?.params?.showHelp]);

  const handlePressCat = (cat) => {
    navigation.navigate("CatDetailScreen", { catId: cat.id, catName: cat.name });
  };

  const navigateToAddCat = (source) => {
    navigation.navigate("AddCat", { imageSource: source });
    setMenuOpen(false);
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={styles.primary} />
        <Text style={styles.loadingText}>Loading cats...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Help Modal */}
      <Modal
        visible={helpModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "85%", maxHeight: '80%', position: "relative" }}>
            <TouchableOpacity
              style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
              onPress={() => setHelpModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" }}>How to Use Posa</Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Home Screen:</Text> View all your cats in a grid. Tap a cat to see its details. Use the <Text style={{ fontWeight: "bold" }}>+</Text> button to open the add menu. Use the <Text style={{ fontWeight: "bold" }}>📷</Text> or <Text style={{ fontWeight: "bold" }}>🖼️</Text> icons to add a new cat with a photo from your camera or gallery.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Add Cat:</Text> Enter the cat's name and select a profile photo (required). You can also add optional details like eye color, fur color, and behavior. The first encounter is logged automatically with the photo and details you provide.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Cat Details:</Text> View all info and encounters for a cat. Edit or delete the cat using the pencil and trash icons. Add new encounters using the floating <Text style={{ fontWeight: "bold" }}>+</Text> button, then choose <Text style={{ fontWeight: "bold" }}>📷</Text> or <Text style={{ fontWeight: "bold" }}>🖼️</Text> to log a new encounter with a photo. Encounters are now labeled (e.g., "Encounter #1") and sorted from newest to oldest.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Add Encounter:</Text> Take or select a photo (required), then add optional location and details. Save to log a new encounter for the cat. Placeholders are always visible until you start typing.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Encounters:</Text> Tap an encounter to expand and see more details at the bottom of the card. Long press the photo to view it fullscreen. You can delete or edit encounters using the trash and pencil icons on the right. Date and location are always centered beside the photo.
              </Text>
              <Text style={{ fontSize: 16, marginBottom: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Navigation:</Text> Use the navigation bar at the top to switch screens. All navigation bars use the same color for consistency.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatCard cat={item} onPress={() => handlePressCat(item)} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.subtitle}>No cats found yet. Add one!</Text>
        }
      />
      {menuOpen && (
        <>
          <TouchableOpacity
            style={[styles.fab, styles.smallFabCamera]}
            onPress={() => navigateToAddCat("camera")}
          >
            <Text style={styles.fabText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fab, styles.smallFabGallery]}
            onPress={() => navigateToAddCat("gallery")}
          >
            <Text style={styles.fabText}>🖼️</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMenuOpen((p) => !p)}
      >
        <Text style={styles.fabText}>{menuOpen ? "×" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
}