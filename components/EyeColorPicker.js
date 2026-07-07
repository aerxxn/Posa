import React, { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { colors } from "../styles";
import { scale, moderateScale, verticalScale } from "../scaling";

const EYE_COLOR_OPTIONS = [
  { name: "Amber", hex: "#FFBF00" },
  { name: "Blue", hex: "#4C8EF7" },
  { name: "Green", hex: "#4CAF50" },
  { name: "Yellow", hex: "#F2D94E" },
  { name: "Hazel", hex: "#8A6E3A" },
  { name: "Copper", hex: "#B87333" },
  { name: "Orange", hex: "#FF8C42" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Aqua", hex: "#4DD0E1" },
  { name: "Violet", hex: "#8B5CF6" },
];

const MAX_SELECTIONS = 2;

const parseEyeColors = (value) => {
  if (!value) return [];
  return String(value)
    .split(/\s*\/\s*|\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, MAX_SELECTIONS);
};

const formatEyeColors = (items) => items.join(" / ");

export default function EyeColorPicker({ label = "Eye Color", value, onChange }) {
  const [visible, setVisible] = useState(false);

  const selected = useMemo(() => parseEyeColors(value), [value]);

  const toggleColor = (name) => {
    const next = selected.includes(name)
      ? selected.filter((item) => item !== name)
      : selected.length < MAX_SELECTIONS
        ? [...selected, name]
        : selected;

    onChange(formatEyeColors(next));
  };

  const displayText = selected.length > 0 ? formatEyeColors(selected) : "Select up to 2 colors";

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        style={{
          minHeight: verticalScale(50),
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: moderateScale(8),
          backgroundColor: colors.cardBackground,
          paddingHorizontal: scale(12),
          paddingVertical: verticalScale(10),
          justifyContent: "center",
          marginBottom: verticalScale(12),
          width: "95%",
          alignSelf: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
            {selected.length > 0 ? (
              selected.map((item) => {
                const option = EYE_COLOR_OPTIONS.find((entry) => entry.name === item);
                return (
                  <View
                    key={item}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: scale(8),
                      marginVertical: verticalScale(2),
                      paddingHorizontal: scale(8),
                      paddingVertical: verticalScale(4),
                      borderRadius: moderateScale(999),
                      backgroundColor: "rgba(92, 64, 51, 0.06)",
                    }}
                  >
                    <View
                      style={{
                        width: moderateScale(12),
                        height: moderateScale(12),
                        borderRadius: moderateScale(6),
                        backgroundColor: option?.hex || colors.border,
                        marginRight: scale(6),
                        borderWidth: 1,
                        borderColor: "rgba(0,0,0,0.12)",
                      }}
                    />
                    <Text style={{ color: colors.text, fontSize: moderateScale(13), fontWeight: "600" }}>
                      {item}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={{ color: colors.subtleText, fontSize: moderateScale(14) }}>{displayText}</Text>
            )}
          </View>
          <Ionicons name="chevron-down" size={moderateScale(18)} color={colors.subtleText} />
        </View>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.modalBackground} onPress={() => setVisible(false)}>
          <Pressable
            onPress={() => {}}
            style={{
              width: "88%",
              maxHeight: "72%",
              backgroundColor: colors.cardBackground,
              borderRadius: moderateScale(18),
              padding: scale(18),
            }}
          >
            <Text style={[styles.title, { marginBottom: verticalScale(8) }]}>Select eye colors</Text>
            <Text style={{ color: colors.subtleText, marginBottom: verticalScale(12), textAlign: "center" }}>
              Choose up to {MAX_SELECTIONS} colors
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {EYE_COLOR_OPTIONS.map((option) => {
                const isSelected = selected.includes(option.name);
                return (
                  <TouchableOpacity
                    key={option.name}
                    activeOpacity={0.85}
                    onPress={() => toggleColor(option.name)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: verticalScale(12),
                      paddingHorizontal: scale(12),
                      borderRadius: moderateScale(12),
                      marginBottom: verticalScale(8),
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? "rgba(139, 111, 78, 0.08)" : colors.cardBackground,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                      <View
                        style={{
                          width: moderateScale(18),
                          height: moderateScale(18),
                          borderRadius: moderateScale(9),
                          backgroundColor: option.hex,
                          marginRight: scale(10),
                          borderWidth: 1,
                          borderColor: "rgba(0,0,0,0.15)",
                        }}
                      />
                      <Text style={{ color: colors.text, fontSize: moderateScale(15), fontWeight: "600" }}>
                        {option.name}
                      </Text>
                    </View>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={moderateScale(20)} color={colors.primary} />
                    ) : (
                      <Ionicons name="ellipse-outline" size={moderateScale(20)} color={colors.border} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{
                marginTop: verticalScale(10),
                backgroundColor: colors.primary,
                paddingVertical: verticalScale(12),
                borderRadius: moderateScale(10),
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.cardBackground, fontSize: moderateScale(16), fontWeight: "700" }}>
                Done
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}