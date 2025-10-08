// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCats } from "../CatContext";
import CatCard from "../components/CatCard";
import styles from "../styles";

export default function HomeScreen({ navigation, route }) {
  const { cats, loading, error } = useCats();
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Show help modal when triggered from header
  useEffect(() => {
    if (route?.params?.showHelp) {
      setHelpModalVisible(true);
      navigation.setParams({ showHelp: false });
    }
  }, [route?.params?.showHelp]);

  // Open camera or gallery
  const pickImage = async (source) => {
    try {
      let result;
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Camera permission is needed to take a photo.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Gallery access is needed to pick a photo.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.8,
        });
      }

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setMenuOpen(false);
        navigation.navigate("AddCat", { imageUri });
      }
    } catch (err) {
      console.error("Image picker error:", err);
    }
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
        transparent
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "85%", maxHeight: "80%" }}>
            <TouchableOpacity
              style={{ position: "absolute", top: 12, right: 12 }}
              onPress={() => setHelpModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, textAlign: "center" }}>How to Use Posa</Text>
               {/* Home Screen Instructions */}
              <Text style={{ fontSize: 14, marginBottom: 15, lineHeight: 22}}>
                <Text style={{ fontWeight: "bold"}}>Home:</Text> View all your known cats here. Tap the <Text style={{fontWeight: "bold"}}>+</Text> button (bottom right) to open options to add a new cat. Choose 📷 to take a photo or 🖼️ to pick from your gallery.
              </Text>

              {/* Cat Detail Screen Instructions */}
              <Text style={{ fontSize: 14, marginBottom: 15, lineHeight: 22}}>
                <Text style={{ fontWeight: "bold"}}>Cat Detail:</Text> Tap on a cat's card to see its profile and a history of encounters. To <Text style={{fontWeight: "bold"}}>add a new encounter</Text>, tap the <Text style={{fontWeight: "bold"}}>+</Text> button (bottom right) and select a photo source. To <Text style={{fontWeight: "bold"}}>edit the cat's profile</Text> or <Text style={{fontWeight: "bold"}}>delete the cat</Text>, use the pencil (✏️) and trash (🗑️) icons next to the cat's name.
              </Text>

              {/* Encounters Instructions */}
              <Text style={{ fontSize: 14, marginBottom: 10, lineHeight: 22}}>
                <Text style={{ fontWeight: "bold"}}>Encounters:</Text> Tap on an encounter card to expand and view its full details. When expanded, you will see options to <Text style={{fontWeight: "bold"}}>edit</Text> (✏️) or <Text style={{fontWeight: "bold"}}>delete</Text> (🗑️) the specific encounter. You can tap the encounter photo to view it fullscreen.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Cat List */}
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatCard cat={item} onPress={() => navigation.navigate("CatDetailScreen", { catId: item.id, catName: item.name })} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.subtitle}>No cats found yet. Add one!</Text>}
        showsVerticalScrollIndicator={false}

      />

      {/* Floating Buttons */}
      {menuOpen && (
        <>
          {/* Camera button above main FAB */}
          <TouchableOpacity
            style={[styles.fab, { bottom: 130 }]}
            onPress={() => pickImage("camera")}
          >
            <Text style={styles.fabText}>📷</Text>
          </TouchableOpacity>

          {/* Gallery button slightly lower & left of main FAB */}
          <TouchableOpacity
            style={[styles.fab, { bottom: 60, right: 100 }]}
            onPress={() => pickImage("gallery")}
          >
            <Text style={styles.fabText}>🖼️</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        style={[styles.fab, { zIndex: 20, elevation: 20 }]}
        onPress={() => setMenuOpen((prev) => !prev)}
      >
        <Text style={styles.fabText}>{menuOpen ? "×" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
}
