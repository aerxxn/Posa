//Cat Detail Screen
// Displays cat information, encounters, and edit/add encounter modals.

//IMPORTS
import EditCatModal from "../components/EditCatModal";
import FabButton from "../components/FabButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as FileSystem from 'expo-file-system/legacy';
import { saveImageToDest } from "../utils/fileUtils";
import { safeLaunchImageLibraryAsync, safeLaunchCameraAsync } from "../utils/safeImagePicker";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCats } from "../CatContext";
import EncounterCard from "../components/EncounterCard";
import styles, { colors } from "../styles";
import { scale, moderateScale, verticalScale } from '../scaling';
import { BEHAVIOR_OPTIONS, EYE_COLOR_OPTIONS, FUR_COLOR_OPTIONS, splitSelections } from "../utils/catAttributes";

//COMPONENT
export default function CatDetailScreen({ route, navigation }) {
  
  //CONTEXT & STATE
  const { catId } = route.params;
  const { cats, updateCat, deleteCat } = useCats();
  const cat = cats.find((c) => c.id === catId);

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  //Editable Cat Info
  const [editableName, setEditableName] = useState("");
  const [editableEye, setEditableEye] = useState("");
  const [editableColor, setEditableColor] = useState("");
  const [editableBehavior, setEditableBehavior] = useState("");
  const [editableImageUri, setEditableImageUri] = useState(null);
  
  //EFFECTS
  // When cat changes (e.g. after edit), update editable fields
  useEffect(() => {
    if (cat) {
      setEditableName(cat.name);
      setEditableEye(cat.eye);
      setEditableColor(cat.color);
      setEditableBehavior(cat.behavior);
      setEditableImageUri(cat.imageUri);
    }
  }, [cat]);
  
  // If cat not found (e.g. deleted), show alert and go back
  useEffect(() => {
    if (!cat) {
      navigation.goBack();
    }
  }, [cat, navigation]);

  if (!cat) {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Cat not found.</Text>
      </View>
    );
  }

  //HANDLER: CAT EDIT/DELETE
  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {    
    let finalImageUri = editableImageUri;

    try {
      // If the selected image isn't already in our documentDirectory, persist it there
      if (finalImageUri && !finalImageUri.startsWith(FileSystem.documentDirectory)) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          finalImageUri,
          [{ resize: { width: 800 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );

        const baseDir = FileSystem.documentDirectory;
        if (!baseDir) {
          throw new Error('No FileSystem.documentDirectory available');
        }
        const ensureDir = `${baseDir}posa_images/`;
        try { await FileSystem.makeDirectoryAsync(ensureDir, { intermediates: true }); } catch (e) { /* ignore */ }

        const extMatch = manipulatedImage.uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
        const ext = extMatch ? extMatch[1] : "jpg";
        const dest = `${ensureDir}${Date.now()}.${ext}`;

        try {
          const persisted = await saveImageToDest(manipulatedImage, dest);
          
          //Verify the file exists
          const info = await FileSystem.getInfoAsync(persisted);

          if (!info.exists){
            throw new Error("Persisted cat image was not found after saving.")
          }

          finalImageUri = persisted;
        } catch (e) {
          console.error('Failed to persist edited cat image, will fall back to original uri', e);
        }
      }
    } catch (e) {
      console.error('Error while processing edited image:', e);
    }

    try {
      await updateCat(catId, {
        name: editableName,
        eye: editableEye,
        color: editableColor,
        behavior: editableBehavior,
        imageUri: finalImageUri,
      });

      setEditModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Cat",
      `Are you sure you want to delete ${cat.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteCat(catId);
              navigation.goBack();
            } catch (e) {
              console.error('Failed to delete cat:', e);
              Alert.alert('Delete failed', 'Could not delete the cat. Please try again.');
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleEdit} style={{ marginRight: scale(18) }}>
            <Ionicons name="create-outline" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={moderateScale(24)} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, catId, editableName, editableEye, editableColor, editableBehavior, editableImageUri]);

  //HANDLER: IMAGE PICKER (EDIT MODAL)
  const handleImagePicker = async (setImage) => {
    try {
      // Ensure we have permission to access the media library first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Gallery access is needed to pick a photo.");
        return;
      }

  const options2 = { quality: 1 };
  const res = await safeLaunchImageLibraryAsync(options2);
      if (!res.canceled && res.assets?.[0]) {
        setImage(res.assets[0].uri);
      }
    } catch (e) {
      console.error("Image picker error:", e);
      Alert.alert("Error", "Failed to open image picker.");
    }
  };

  //HANDLER: PICK IMAGE & NAVIGATE TO ADD ENCOUNTER
  const pickAndNavigateToAddEncounter = async (source) => {
    try {
      let res;
      if (source === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Camera permission is needed to take a photo.");
          return;
        }
  const cameraOptions = { quality: 1 };
  res = await safeLaunchCameraAsync(cameraOptions);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission required", "Gallery access is needed to pick a photo.");
          return;
        }
  const libOptions = { quality: 1 };
  res = await safeLaunchImageLibraryAsync(libOptions);
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

  //UI HELPERS
  const renderValueChips = (value, options, showSwatches = true) => {
    const selected = splitSelections(value);

    if (selected.length === 0) {
      return <Text style={styles.detailRowValue}>N/A</Text>;
    }

    const optionMap = new Map(options.map((option) => [option.name, option]));

    return (
      <View style={styles.detailValueWrap}>
        {selected.map((item) => {
          const option = optionMap.get(item);
          return (
            <View key={item} style={styles.detailChip}>
              {showSwatches && option?.hex ? (
                <View style={[styles.detailChipDot, { backgroundColor: option.hex }]} />
              ) : null}
              <Text style={styles.detailChipText}>{item}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderDetailRow = (iconName, label, value, options, showSwatches = true) => (
    <View style={styles.detailRow}>
      <View style={styles.detailRowLeft}>
        <Ionicons name={iconName} size={moderateScale(18)} color={colors.subtleText} />
        <Text style={styles.detailRowLabel}>{label}</Text>
      </View>
      {renderValueChips(value, options, showSwatches)}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.sectionPadding}>
      <Image
        source={{ uri: cat.imageUri }}
        style={{
          width: scale(250),
          height: scale(250),
          borderRadius: moderateScale(30),
          alignSelf: "center",
          marginBottom: verticalScale(10),
          resizeMode: "cover",
        }}
      />

      {/*CAT INFO*/}
        <View style={styles.catHeader}>
          <Text style={styles.detailTitle}>{cat.name}</Text>
        </View>

        {renderDetailRow("eye-outline", "Eye Color", cat.eye, EYE_COLOR_OPTIONS)}
        {renderDetailRow("color-palette-outline", "Fur Color", cat.color, FUR_COLOR_OPTIONS)}
        {renderDetailRow("heart-outline", "Behavior", cat.behavior, BEHAVIOR_OPTIONS, false)}

        <View>
          <Text style={styles.sectionTitle}>Encounters</Text>
        </View>
    </View>
  );

  //RENDER
  return (
    <View style={[styles.backgroundScreen]}>
      <FlatList
        data={[...(cat.encounters || [])].slice().reverse()}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()} renderItem={({ item, index }) => (
          <EncounterCard
            encounter={item}
            catId={cat.id}
            encounterId={item.id}
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
        contentContainerStyle={[styles.scrollContainer,{ paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      />

      {/*FULLSCREEN IMAGE MODAL*/}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <Image source={{ uri: currentImageUri }} style={[styles.fullscreenImage]} />
        </TouchableOpacity>
      </Modal>

      {/*EDIT CAT MODAL*/}
      <EditCatModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
        editableCat={{
          name: editableName,
          eye: editableEye,
          color: editableColor,
          behavior: editableBehavior,
          imageUri: editableImageUri,
        }}
        setEditableCat={(updater) => {
          const next =
            typeof updater === "function"
              ? updater({
                  name: editableName,
                  eye: editableEye,
                  color: editableColor,
                  behavior: editableBehavior,
                  imageUri: editableImageUri,
                })
              : updater;

          setEditableName(next.name);
          setEditableEye(next.eye);
          setEditableColor(next.color);
          setEditableBehavior(next.behavior);
          setEditableImageUri(next.imageUri);
        }}
        handleImagePicker={() => handleImagePicker(setEditableImageUri)}
      />

      {/*FLOATING BUTTONS*/}
      {menuOpen && (
        <>
          <FabButton
            icon="📷"
            position={{ bottom: 110, right: 20 }}
            onPress={() => pickAndNavigateToAddEncounter("camera")}
          />
          <FabButton
            icon="🖼️"
            position={{ bottom: 40, right: 90 }}
            onPress={() => pickAndNavigateToAddEncounter("gallery")}
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
