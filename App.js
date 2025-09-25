// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CatProvider } from "./CatContext";
import HomeScreen from "./screens/HomeScreen";
import AddCatScreen from "./screens/AddCatScreen";
import CatDetailScreen from "./screens/CatDetailScreen";
import AddEncounterScreen from "./screens/AddEncounterScreen";
import { TouchableOpacity, View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "./styles"; // Import colors from the styles file

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CatProvider>
      <NavigationContainer>
        <Stack.Navigator>
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
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.setParams({ showHelp: true })} style={{ marginRight: 10 }}>
                  <Ionicons name="help-circle-outline" size={28} color="#fff" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AddCat"
            component={AddCatScreen}
            options={{
              title: "Add New Cat",
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold",
              },
            }}
          />
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