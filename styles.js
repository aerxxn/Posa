// styles.js
import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // (Screen width - padding) / 2
// styles.js

// styles.js

export const colors = {
  // A lighter, soft brown for the main action color.
  primary: "#8B6F4E",

  // A lighter tan for the overall background.
  background: "#F3E5D8",

  // A soft, creamy off-white for cards and elevated components.
  cardBackground: "#FFFFFF",

  // A lighter brown for the main text, creating a clean look.
  text: "#5C4033",

  // A lighter brown for secondary text and subheadings.
  secondaryText: "#BCA18A",

  // A muted, complementary red for the danger color.
  danger: "#B55050",
};
export default StyleSheet.create({
    // ===== DETAIL SCREEN =====
  // styles.js

detailImage: {
  width: "100%", // The width will be the full screen width
  aspectRatio: 1, // This makes the height equal to the width, creating a square
  resizeMode: "cover",
  borderRadius: 10,
},

  detailTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  // ===== CONTAINERS & LAYOUT =====
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
    padding: 15,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },

  // ===== TYPOGRAPHY =====
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.subtleText,
    textAlign: 'center',
    marginVertical: 20,
  },
  fabText: {
    fontSize: 28,
    color: colors.cardBackground,
    fontWeight: '300'
  },
  buttonText: {
    color: colors.cardBackground,
    fontSize: 16,
    fontWeight: "600",
  },
  
  // ===== CARDS & LISTS =====
  listContent: {
    paddingBottom: 140,
    alignItems: 'center',
  },
  card: {
    width: cardWidth,
    height: 180,
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
    width: cardWidth - 20, // Keep it proportional to card width
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

  // ===== FORMS & BUTTONS =====
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
    height: 50,
  },

  detailsInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  imageInputContainer: {
    width: 150,
    height: 150,
    backgroundColor: colors.cardBackground,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholderText: {
    color: colors.subtleText,
    fontSize: 14,
  },

  // ===== FLOATING ACTION BUTTONS (FAB) =====
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
  smallFabCamera: {
    bottom: 130,
    right: 30,
  },
  smallFabGallery: {
    bottom: 60,
    right: 100,
  },

  // ===== DETAIL SCREEN =====
  detailImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "cover",
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
  },
  detailText: {
    fontSize: 16,
    color: colors.subtleText,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  
  // === ADDED STYLES FOR DETAIL SCREEN ===
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  catHeaderActions: {
    flexDirection: 'row',
  },
  editButton: {
    marginLeft: 15,
  },
  deleteButton: {
    marginLeft: 15,
  },
  encounterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  // ===== ENCOUNTER CARDS =====
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
  encounterInfo: {
    flex: 1,
    justifyContent: 'center',
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
  encounterDetail: {
  fontSize: moderateScale(16),
  color: colors.text,
},

detailTitle: {
  fontSize: moderateScale(28),
  fontWeight: "bold",
  color: colors.text,
},
  encounterActionButtons: {
    flexDirection: "column",
    position: "absolute",
    right: 10,
  top: 5,
    alignItems: 'center',
    gap: 8,
  },
  
  // ===== MODALS =====
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 12,
  },
  modalCard: {
    backgroundColor: colors.cardBackground,
    padding: 24,
    borderRadius: 28,
    width: "75%",
    minHeight: 320,
    alignSelf: "center",
  marginTop: 120,
  marginBottom: 40,
    justifyContent: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 15,
    resizeMode: 'cover',
  },
  modalChangePhotoText: {
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});