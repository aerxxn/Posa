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
        {
          text: "Cancel",
          style: "cancel",
        },
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

  const handleImagePicker = async (setImage) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImage(res.assets[0].uri);
    }
  };

  const handleCameraPicker = async (setImage) => {
    const res = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) {
      setImage(res.assets[0].uri);
    }
  };

  const navigateToAddEncounter = (source) => {
    navigation.navigate("AddEncounterScreen", { catId: cat.id, catName: cat.name, imageSource: source });
    setMenuOpen(false);
  };

  const renderHeader = () => (
    <View style={{ padding: 10 }}>
      <Image
        source={{ uri: cat.imageUri }}
        style={{
          width: 250,
          height: 250,
          borderRadius: 30,
          alignSelf: 'center',
          marginBottom: 20,
          resizeMode: 'cover',
        }}
      />
      <View>
        <View style={styles.catHeader}>
          <Text style={styles.detailTitle}>{cat.name}</Text>
          <View style={styles.catHeaderActions}>
            <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
              <Ionicons name="create-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color={colors.danger} />
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
      <View style={styles.encounterHeader}>
        <Text style={styles.sectionTitle}>Encounters</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cat.encounters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <EncounterCard
            encounter={item}
            catId={cat.id}
            encounterIndex={index}
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
        ItemSeparatorComponent={() => <View />}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
      {/* Fullscreen Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalTouchable}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={{ uri: currentImageUri }}
            style={styles.fullscreenImage}
          />
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
          <ScrollView contentContainerStyle={styles.modalCard}>
            <Text style={styles.title}>Edit Cat</Text>
            <TouchableOpacity onPress={() => handleImagePicker(setEditableImageUri)}>
              <Image
                source={{ uri: editableImageUri }}
                style={styles.modalImage}
              />
              <Text style={styles.modalChangePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={editableName}
              onChangeText={setEditableName}
            />
            <TextInput
              style={styles.input}
              placeholder="Eye Color"
              value={editableEye}
              onChangeText={setEditableEye}
            />
            <TextInput
              style={styles.input}
              placeholder="Fur Color"
              value={editableColor}
              onChangeText={setEditableColor}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="Behavior"
              value={editableBehavior}
              onChangeText={setEditableBehavior}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#aaa', flex: 1, marginRight: 10 }]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { flex: 1 }]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* New FABs */}
      {menuOpen && (
        <>
          <TouchableOpacity
            style={[styles.fab, styles.smallFabCamera]}
            onPress={() => navigateToAddEncounter("camera")}
          >
            <Text style={styles.fabText}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fab, styles.smallFabGallery]}
            onPress={() => navigateToAddEncounter("gallery")}
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