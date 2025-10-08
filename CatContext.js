// CatContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CatContext = createContext();

export const CatProvider = ({ children }) => {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const STORAGE_KEY = "@Posa:cats";

  const loadCats = async () => {
    try {
      const storedCats = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCats !== null) {
        setCats(JSON.parse(storedCats));
      }
    } catch (e) {
      console.error("Failed to load cats from storage", e);
      setError("Failed to load your cats. Please restart the app.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCats();
  }, []);

  const saveCats = async (newCats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCats));
      setCats(newCats);
    } catch (e) {
      console.error("Failed to save cats", e);
      setError("Failed to save data. Please try again.");
    }
  };

  const addCat = (newCat, callback) => {
    const updatedCats = [...cats, { ...newCat, id: Date.now().toString() }];
    saveCats(updatedCats);
    if (callback) callback();
  };

  const deleteCat = (catId) => {
    const updatedCats = cats.filter((cat) => cat.id !== catId);
    saveCats(updatedCats);
  };

  const updateCat = (catId, updatedCatData) => {
    const updatedCats = cats.map((cat) =>
      cat.id === catId ? { ...cat, ...updatedCatData } : cat
    );
    saveCats(updatedCats);
  };

  const addEncounter = (catId, newEncounter) => {
    const updatedCats = cats.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          encounters: [...(cat.encounters || []), newEncounter],
        };
      }
      return cat;
    });
    saveCats(updatedCats);
  };


  // Update an existing encounter for a cat
  const updateEncounter = (catId, encounterId, updatedEncounter) => {
    const updatedCats = cats.map(cat => {
      if (cat.id === catId) {
        const updatedEncounters = cat.encounters.map(item =>
          item.id === encounterId ? updatedEncounter : item
        );
        return { ...cat, encounters: updatedEncounters };
      }
      return cat;
    });
    saveCats(updatedCats);
  };

  // Add this new function to handle encounter deletion
  const deleteEncounter = (catId, encounterId) => {
    const updatedCats = cats.map(cat => {
      if (cat.id === catId) {
        const updatedEncounters = cat.encounters.filter(
          item => item.id !== encounterId
        );
        return { ...cat, encounters: updatedEncounters };
      }
      return cat;
    });
    saveCats(updatedCats);
  };

  return (
    <CatContext.Provider
      value={{
        cats,
        loading,
        error,
  addCat,
  deleteCat,
  updateCat,
  addEncounter,
  updateEncounter, // Add the update encounter function
  deleteEncounter,
      }}
    >
      {children}
    </CatContext.Provider>
  );
};

export const useCats = () => {
  return useContext(CatContext);
};