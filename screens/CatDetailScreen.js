//Cat Detail Screen
// Displays cat information, encounters, and edit/add encounter modals.

//IMPORTS
import EditCatModal from "../components/EditCatModal";
import FabButton from "../components/FabButton";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
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

  //HANDLER: IMAGE PICKER (EDIT MODAL)
  const handleImagePicker = async (setImage) => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        quality: 1,
      });
      if (!res.canceled && res.assets?.[0]) {
        setImage(res.assets[0].uri);
      }
    } catch (e) {
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
        res = await ImagePicker.launchCameraAsync({
          mediaTypes: [ImagePicker.MediaType.IMAGE],
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

  //UI HELPERS
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

          {/*ACTION ICONS*/}
          <View style={styles.catHeaderActions}>
            <TouchableOpacity onPress={handleDelete} style={{ marginBottom: verticalScale(8) }}>
              <Ionicons name="trash-outline" size={moderateScale(24)} color={colors.danger} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEdit}>
              <Ionicons name="create-outline" size={moderateScale(24)} color={colors.text} />
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
