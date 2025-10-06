// screens/CatDetailScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useCats } from "../CatContext";
import styles, { colors } from "../styles";
import EncounterCard from "../components/EncounterCard";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function CatDetailScreen({ route, navigation }) {
  const { catId } = route.params;
  const { cats, updateCat, deleteCat } = useCats();
  const cat = cats.find((c) => c.id === catId);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [editableName, setEditableName] = useState("");
  const [editableEye, setEditableEye] = useState("");
  const [editableColor, setEditableColor] = useState("");
  const [editableBehavior, setEditableBehavior] = useState("");
  const [editableImageUri, setEditableImageUri] = useState(null);

  useEffect(() => {
    if (cat) {
      setEditableName(cat.name);
      setEditableEye(cat.eye);
      setEditableColor(cat.color);
      setEditableBehavior(cat.behavior);
      setEditableImageUri(cat.imageUri);
    }
  }, [cat]);

  if (!cat) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Cat not found.</Text>
      </View>
    );
  }

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    updateCat(catId, {
      name: editableName,
      eye: editableEye,
      color: editableColor,
      behavior: editableBehavior,
      imageUri: editableImageUri,
    });
    setEditModalVisible(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Cat",
      `Are you sure you want to delete ${cat.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            deleteCat(catId);
            navigation.goBack();
          },
          style: "destructive",
        },
      ]
    );
  };

  // Small helper used by Edit modal to pick photo
  const handleImagePicker = async (setImage) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!res.canceled && res.assets?.[0]) {
        setImage(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  // Pick image (camera or gallery) here in CatDetailScreen then navigate with uri
  const pickAndNavigateToAddEncounter = async (source) => {
    try {
      let res;
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Camera permission is needed to take a photo.");
          return;
        }
        res = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Gallery access is needed to pick a photo.");
          return;
        }
        res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
      }

      if (!res.canceled && res.assets?.[0]) {
        const imageUri = res.assets[0].uri;
        setMenuOpen(false);
        navigation.navigate("AddEncounterScreen", {
          catId: cat.id,
          catName: cat.name,
          imageUri, // pass the actual uri
        });
      }
    } catch (err) {
      console.error("Image picker error:", err);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const renderHeader = () => (
    <View style={{ padding: 10 }}>
      <Image
        source={{ uri: cat.imageUri }}
        style={{
          width: 250,
          height: 250,
          borderRadius: 30,
          alignSelf: "center",
          marginBottom: 10,
          resizeMode: "cover",
        }}
      />
      <View>
        <View style={styles.catHeader}>
          <Text style={styles.detailTitle}>{cat.name}</Text>

          {/* Right-most stacked actions: trash on top, edit below */}
          <View style={[styles.catHeaderActions, { flexDirection: "column", right: 10 }]}>
            <TouchableOpacity onPress={handleDelete} style={{ marginBottom: 8 }}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Eye Color:</Text> {cat.eye || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Fur Color:</Text> {cat.color || "N/A"}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Behavior:</Text> {cat.behavior || "N/A"}
        </Text>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Encounters</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[...(cat.encounters || [])].slice().reverse()}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}        renderItem={({ item, index }) => (
          <EncounterCard
            encounter={item}
            catId={cat.id}
            encounterId={item.id}
            totalEncounters={cat.encounters?.length ?? 0}
            displayIndex={index}
            onLongPress={() => {
              setCurrentImageUri(item.photo);
              setModalVisible(true);
            }}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={[styles.subtitle, { paddingHorizontal: 10 }]}>No encounters logged.</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Fullscreen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <Image source={{ uri: currentImageUri }} style={[styles.fullscreenImage, { borderRadius: 24 }]} />
        </TouchableOpacity>
      </Modal>

      {/* Edit Cat Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.title}>Edit Cat</Text>

              <TouchableOpacity onPress={() => handleImagePicker(setEditableImageUri)}>
                <Image source={{ uri: editableImageUri }} style={styles.modalImage} />
                <Text style={styles.modalChangePhotoText}>Change Photo</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#7A5C3E"
                value={editableName}
                onChangeText={setEditableName}
              />
              <TextInput
                style={styles.input}
                placeholder="Eye Color"
                placeholderTextColor="#7A5C3E"
                value={editableEye}
                onChangeText={setEditableEye}
              />
              <TextInput
                style={styles.input}
                placeholder="Fur Color"
                placeholderTextColor="#7A5C3E"
                value={editableColor}
                onChangeText={setEditableColor}
              />
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                placeholder="Behavior"
                placeholderTextColor="#7A5C3E"
                value={editableBehavior}
                onChangeText={setEditableBehavior}
                multiline
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: "#aaa", flex: 1, marginRight: 10 }]}
                  onPress={() => setEditModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={handleSaveEdit}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Floating Buttons */}
      {menuOpen && (
        <>
          {/* Camera button above main FAB */}
          <TouchableOpacity
            style={[styles.fab, { bottom: 130 }]}
            onPress={() => pickAndNavigateToAddEncounter("camera")}
          >
            <Text style={styles.fabText}>📷</Text>
          </TouchableOpacity>

          {/* Gallery button slightly lower & left of main FAB */}
          <TouchableOpacity
            style={[styles.fab, { bottom: 60, right: 100 }]}
            onPress={() => pickAndNavigateToAddEncounter("gallery")}
          >
            <Text style={styles.fabText}>🖼️</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        style={[styles.fab, { zIndex: 20, elevation: 20 }]}
        onPress={() => setMenuOpen((p) => !p)}
      >
        <Text style={styles.fabText}>{menuOpen ? "×" : "+"}</Text>
      </TouchableOpacity>
    </View>
  );
}
