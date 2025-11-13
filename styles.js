// styles.js
import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from './scaling';

const { width, height } = Dimensions.get("window");
const cardWidth = (width - scale(48)) / 2; // (Screen width - padding) / 2

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
    alignItems: "center",
    paddingTop: verticalScale(5),
    paddingHorizontal: scale(10)// small top breathing room
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: scale(5),
    paddingBottom: verticalScale(40),
    
  },
  backgroundScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ===== TYPOGRAPHY =====
  title: {
    alignSelf: "center",
    fontSize: moderateScale(22),
    fontWeight: "bold",
    color: colors.text,
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontWeight: "600",
    color: colors.subtleText,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  bodyText: {
    fontSize: moderateScale(14),
    color: colors.text,
  },
  label: {
    fontSize: moderateScale(14),
    fontWeight: "bold",
    color: "#7A5C3E",
    marginBottom: verticalScale(4),
  },
  fabText: {
    fontSize: moderateScale(28),
    color: colors.cardBackground,
    fontWeight: "300",
  },

  // ===== CARDS =====
  listContent: {
    paddingBottom: verticalScale(100),
    alignItems: "center",
  },
  card: {
    width: cardWidth,
    height: verticalScale(175),
    backgroundColor: colors.cardBackground,
    borderRadius: moderateScale(12),
    padding: scale(10),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(8),
    marginVertical: scale(4),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardImage: {
    width: cardWidth - scale(20),
    height: cardWidth - scale(20),
    borderRadius: moderateScale(10),
    marginBottom: verticalScale(8),
    resizeMode: "cover",
  },
  cardName: {
    fontSize: moderateScale(18),
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  // ===== FORMS & INPUTS =====
  input: {
    width: "95%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: moderateScale(8),
    padding: scale(12),
    marginBottom: verticalScale(12),
    fontSize: moderateScale(16),
    backgroundColor: colors.cardBackground,
    color: colors.text,
  },

  inputMultiline: {
    height: verticalScale(90),
    textAlignVertical: "top",
  },

  // ===== BUTTONS =====
  button: {
    backgroundColor: colors.primary,
    padding: scale(14),
    borderRadius: moderateScale(8),
    alignItems: "center",
    marginTop: verticalScale(10),
  },
  buttonText: {
    color: colors.cardBackground,
    fontSize: moderateScale(16),
    fontWeight: "600",
  },

  // ===== FAB =====
  fab: {
    position: "absolute",
    bottom: verticalScale(60),
    right: scale(30),
    backgroundColor: colors.primary,
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
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
  width: scale(50),
  height: scale(50),
  borderRadius: scale(25),
  alignItems: "center",
  justifyContent: "center",
  elevation: 8, // shadow
},


  // ===== DETAIL SCREEN =====
  detailImage: {
    width: "100%",
    height: verticalScale(250),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(20),
    resizeMode: "cover",
  },
  detailTitle: {
    fontSize: moderateScale(35),
    fontWeight: "bold",
    color: colors.text,
    
  },
  detailText: {
    fontSize: moderateScale(16),
    color: colors.subtleText,
    marginBottom: verticalScale(5),
  },
  sectionTitle: {
    alignSelf: "center",
    fontSize: moderateScale(25),
    fontWeight: "bold",
    color: colors.text,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  sectionPadding:{
    padding: scale(10)
  },
  catHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",   // centers content
    position: "relative",       // lets us absolutely position the buttons
    marginBottom: verticalScale(8),
  },

  catHeaderActions: {
    position: "absolute",
    right: 0,                   // stick buttons to the right edge
    alignItems: "center",
    flexDirection: "column", 
    right: scale(10)
  },

  editButton: {
    marginRight: scale(12),
  },



  // ===== ENCOUNTERS =====
  encounterCard: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: colors.cardBackground,
    borderRadius: moderateScale(12),
    padding: scale(15),
    marginBottom: verticalScale(12),
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  encounterImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: moderateScale(10),
    marginRight: scale(15),
    resizeMode: "cover",
  },
  encounterTitle: {
    fontSize: moderateScale(16),
    fontWeight: "bold",
    color: colors.accent,
  },
  encounterDate: {
    fontSize: moderateScale(14),
    color: colors.subtleText,
    marginBottom: verticalScale(4),
  },
  encounterLocation: {
    fontSize: moderateScale(14),
    color: colors.text,
    marginBottom: verticalScale(4),
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
    borderRadius: moderateScale(16),
    padding: scale(20),
  },
  modalTitle: {
    fontSize: moderateScale(20),
    fontWeight: "bold",
    marginBottom: verticalScale(15),
    alignSelf: "center",
    color: colors.text,
  },
  modalImage: {
    width: scale(100),
    height: scale(100),
    alignSelf: "center",
    borderRadius: moderateScale(12),
  },
  modalChangePhotoText: {
    marginTop: verticalScale(8),
    textAlign: "center",
    color: colors.primary,
  },
  modalInput: {
    height: verticalScale(40),
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(10),
    marginVertical: verticalScale(8),
    color: colors.text,
  },
  modalInputMultiline: {
    height: verticalScale(80),
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: verticalScale(20),
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: scale(14),
    borderRadius: moderateScale(8),
    alignItems: "center",
    marginHorizontal: scale(5),
  },
  modalCancel: {
    backgroundColor: colors.cancel,
  },
  modalSave: {
    backgroundColor: colors.primary,
  },
  modalButtonText: {
    color: colors.cardBackground,
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  fullscreenImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain", // ✅ keep aspect ratio
    borderRadius: moderateScale(24)
  }
});
