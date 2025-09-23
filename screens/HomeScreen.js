// screens/HomeScreen.js
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
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
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "85%", position: "relative" }}>
            <TouchableOpacity
              style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
              onPress={() => setHelpModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" }}>How to Use Posa</Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Home Screen:</Text> View all your cats. Tap a cat to see its details. Use the + button to add a new cat. Use the camera or gallery icons to add a cat with a photo.
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Add Cat:</Text> Enter the cat's name, eye color, fur color, and behavior. Add a profile photo. Save to add the cat to your collection.
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Cat Details:</Text> View cat info and all encounters. Edit or delete the cat. Add new encounters using the floating buttons.
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Add Encounter:</Text> Take or select a photo, add location and details. Save to log a new encounter for the cat.
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Encounters:</Text> Tap an encounter to expand details. Long press the photo to view fullscreen. Edit or delete encounters as needed.
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              <Text style={{ fontWeight: "bold" }}>Navigation:</Text> Use the navigation bar to switch screens. All navigation bars have a consistent color for easy recognition.
            </Text>
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