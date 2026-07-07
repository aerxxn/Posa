import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles, { colors } from "../styles";
import { scale, moderateScale, verticalScale } from "../scaling";
import { joinSelections, splitSelections } from "../utils/catAttributes";

const AttributePicker = forwardRef(function AttributePicker(
  {
    label,
    title,
    placeholder,
    value,
    onChange,
    options,
    maxSelections = 1,
    showSwatches = true,
    onDone,
    containerStyle,
    triggerStyle,
  },
  ref
) {
  const [visible, setVisible] = useState(false);

  const selected = useMemo(() => splitSelections(value).slice(0, maxSelections), [value, maxSelections]);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
  }));

  const close = () => {
    setVisible(false);
    if (onDone) onDone();
  };

  const toggleSelection = (name) => {
    const next = selected.includes(name)
      ? selected.filter((item) => item !== name)
      : selected.length < maxSelections
        ? [...selected, name]
        : selected;

    onChange(joinSelections(next));

    if (maxSelections === 1) {
      setVisible(false);
      if (onDone) onDone();
    }
  };

  const displayText = selected.length > 0 ? joinSelections(selected) : placeholder;

  return (
    <View style={[{ width: "100%" }, containerStyle]}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setVisible(true)}
        style={[
          {
          minHeight: verticalScale(50),
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: moderateScale(8),
          backgroundColor: colors.cardBackground,
          paddingHorizontal: scale(12),
          paddingVertical: verticalScale(10),
          justifyContent: "center",
          marginBottom: verticalScale(12),
          width: "100%",
          alignSelf: "stretch",
        }, triggerStyle]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", flexWrap: "wrap" }}>
            {selected.length > 0 ? (
              selected.map((item) => {
                const option = options.find((entry) => entry.name === item);
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
                    {showSwatches && option?.hex ? (
                      <View
                        style={{
                          width: moderateScale(12),
                          height: moderateScale(12),
                          borderRadius: moderateScale(6),
                          backgroundColor: option.hex,
                          marginRight: scale(6),
                          borderWidth: 1,
                          borderColor: "rgba(0,0,0,0.12)",
                        }}
                      />
                    ) : null}
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

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <Pressable style={styles.modalBackground} onPress={close}>
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
            <Text style={[styles.title, { marginBottom: verticalScale(8) }]}>{title}</Text>
            <Text style={{ color: colors.subtleText, marginBottom: verticalScale(12), textAlign: "center" }}>
              {maxSelections === 1 ? "Choose 1 option" : `Choose up to ${maxSelections} options`}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const isSelected = selected.includes(option.name);
                return (
                  <TouchableOpacity
                    key={option.name}
                    activeOpacity={0.85}
                    onPress={() => toggleSelection(option.name)}
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
                      {showSwatches && option.hex ? (
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
                      ) : null}
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

            {maxSelections > 1 ? (
              <TouchableOpacity
                onPress={close}
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
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
});

export default AttributePicker;
