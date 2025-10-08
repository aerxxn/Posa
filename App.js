// App.js - Main entry point for the Posa app
// Imports React and navigation libraries
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// Import context provider for cat data
import { CatProvider } from "./CatContext";
// Import screens for navigation
import HomeScreen from "./screens/HomeScreen";
import AddCatScreen from "./screens/AddCatScreen";
import CatDetailScreen from "./screens/CatDetailScreen";
import AddEncounterScreen from "./screens/AddEncounterScreen";
// Import styles and icons
import { colors } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, Image } from "react-native";

// Create a stack navigator for screen transitions
const Stack = createNativeStackNavigator();

// Main App component wraps everything in CatProvider and NavigationContainer
export default function App() {
  return (
    // CatProvider supplies cat data and actions to all screens
    <CatProvider>
      {/* NavigationContainer manages navigation state */}
      <NavigationContainer>
        {/* Stack.Navigator defines the navigation stack */}
        <Stack.Navigator>
          {/* Home screen with custom header and help button */}
          <Stack.Screen
            name="Posa"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={require("./assets/hslogo.png")}
                    style={{ width: 32, height: 32, marginRight: 8, borderRadius: 8 }}
                  />
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>Posa</Text>
                </View>
              ),
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              // Help button opens help modal
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.setParams({ showHelp: true })} style={{ marginRight: 10 }}>
                  <Ionicons name="help-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
              ),
            })}
          />
          {/* Add Cat screen for adding a new cat */}
          <Stack.Screen
            name="AddCat"
            component={AddCatScreen}
            options={{
              title: "New Cat Acquired!",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          {/* Cat Detail screen for viewing/editing a cat */}
          <Stack.Screen
            name="CatDetailScreen"
            component={CatDetailScreen}
            options={{
              title: "Cat Details",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
          {/* Add Encounter screen for logging a new encounter */}
          <Stack.Screen
            name="AddEncounterScreen"
            component={AddEncounterScreen}
            options={({ route }) => ({
              title: `You meet ${route.params.catName} again!`,
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 18,
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CatProvider>
  );
}