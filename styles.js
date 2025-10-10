// styles.js
import { StyleSheet, Dimensions } from "react-native";
const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // (Screen width - padding) / 2

export const colors = {
  primary: "#8B6F4E",
  background: "#F3E5D8",
  cardBackground: "#FFFFFF",
  text: "#5C4033",
  secondaryText: "#BCA18A",
  subtleText: "#8B6F4E",
  danger: "#B55050",
  border: "#D1C4B5",
  shadow: "#000",
  accent: "#A68A64",
  cancel: "#B0B0B0", // Neutral gray for Cancel
};

export default StyleSheet.create({
  // ===== CONTAINERS =====
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,   // horizontal gutter
    paddingTop: 12,          // small top breathing room
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 5,
    paddingBottom: 40,
  },
  backgroundScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ===== TYPOGRAPHY =====
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.subtleText,
    textAlign: "center",
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#7A5C3E",
    marginBottom: 4,
  },
  fabText: {
    fontSize: 28,
    color: colors.cardBackground,
    fontWeight: "300",
  },

  // ===== CARDS =====
  listContent: {
    paddingBottom: 100,
    alignItems: "center",
  },
  card: {
    width: cardWidth,
    height: 190,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: cardWidth - 20,
    height: cardWidth - 20,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "cover",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  // ===== FORMS & INPUTS =====
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: colors.cardBackground,
    color: colors.text,
  },
  inputMultiline: {
    height: 90,
    textAlignVertical: "top",
  },

  // ===== BUTTONS =====
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: "600",
  },

  // ===== FAB =====
  fab: {
    position: "absolute",
    bottom: 60,
    right: 30,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 20,
  },
  fabOption: {
  position: "absolute",
  backgroundColor: "#03dac6", // or same as your HomeScreen option buttons
  width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: "center",
  justifyContent: "center",
  elevation: 8, // shadow
},


  // ===== DETAIL SCREEN =====
  detailImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "cover",
  },
  detailTitle: {
    fontSize: 35,
    fontWeight: "bold",
    color: colors.text,
    
  },
  detailText: {
    fontSize: 16,
    color: colors.subtleText,
    marginBottom: 5,
  },
  sectionTitle: {
    alignSelf: "center",
    fontSize: 25,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionPadding:{
    padding:10
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",   // centers content
    position: "relative",       // lets us absolutely position the buttons
    marginBottom: 8,
  },

  catHeaderActions: {
    position: "absolute",
    right: 0,                   // stick buttons to the right edge
    flexDirection: "row",    // stack Edit over Trash
    alignItems: "center",
  },

  editButton: {
    marginRight: 12,
  },



  // ===== ENCOUNTERS =====
  encounterCard: {
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  encounterImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    resizeMode: "cover",
  },
  encounterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.accent,
  },
  encounterDate: {
    fontSize: 14,
    color: colors.subtleText,
    marginBottom: 4,
  },
  encounterLocation: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },

  // ===== MODALS =====
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    alignSelf: "center",
    color: colors.text,
  },
  modalImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 12,
  },
  modalChangePhotoText: {
    marginTop: 8,
    textAlign: "center",
    color: colors.primary,
  },
  modalInput: {
    height: 40,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    color: colors.text,
  },
  modalInputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalCancel: {
    backgroundColor: colors.cancel,
  },
  modalSave: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: "600",
  },
  fullscreenImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain", // ✅ keep aspect ratio
    borderRadius: 24
  }
});
