// components/PhotoPicker.js
import { TouchableOpacity, Image, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { scale, moderateScale, verticalScale } from '../scaling';
import styles from "../styles";

/**
 * Simple reusable photo picker used in AddCatScreen & AddEncounterScreen
 * Props:
 * - imageUri: current image uri
 * - onChange: callback when a new image is picked
 * - label: optional text shown above the photo
 */
export default function PhotoPicker({ imageUri, onChange, label }) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!res.canceled && res.assets?.[0]) onChange(res.assets[0].uri);
  };

  return (
    <View style={{ alignItems: "center", marginBottom: verticalScale(20) }}>
      {label && (
        <Text
          style={{
            fontWeight: "bold",
            color: "#7A5C3E",
            marginBottom: verticalScale(8),
            fontSize: moderateScale(14),
          }}
        >
          {label}
        </Text>
      )}
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: imageUri }}
          style={{
            width: scale(200),
            height: scale(200),
            borderRadius: moderateScale(12),
            marginBottom: verticalScale(6),
            backgroundColor: "#f0e6d8",
          }}
        />
        <Text style={{ color: "#7A5C3E", alignSelf:"center"}}>Change Photo</Text>
      </TouchableOpacity>
    </View>
  );
}
