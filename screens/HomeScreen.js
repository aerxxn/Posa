// screens/HomeScreen.js
import FabButton from "../components/FabButton";
import HelpModal from "../components/HelpModal";
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert } from "react-native";
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
    <View style={styles.modalBackground}>
      {/* Help Modal */}
      <HelpModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
      />

      {/* Cat List */}
      <FlatList
        data={cats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CatCard cat={item} onPress={() => navigation.navigate("CatDetailScreen", { catId: item.id, catName: item.name })} />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.scrollContainer}
        ListEmptyComponent={<Text style={styles.subtitle}>No cats found yet. Add one!</Text>}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      {menuOpen && (
        <>
          <FabButton
            icon="📷"
            position={{ bottom: 110, right: 20 }}
            onPress={() => pickImage("camera")}
          />

          <FabButton
            icon="🖼️"
            position={{ bottom: 40, right: 90 }}
            onPress={() => pickImage("gallery")}
          />
        </>
      )}

      {/* Main FAB */}
      <FabButton
        icon={menuOpen ? "×" : "+"}
        onPress={() => setMenuOpen((p) => !p)}
      />
    </View>
  );
}
