// CatContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

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
        const parsed = JSON.parse(storedCats);

        setCats(parsed);
      }
    } catch (e) {
      console.error("Failed to load cats from storage", e);
      setError("Failed to load your cats. Please restart the app.");
    } finally {
      setLoading(false);
    }
  };

  // Safe delete helper: check existence before trying to delete to avoid "file not found" errors
  const safeDelete = async (uri) => {
    try {
      if (!uri) return;
      // Only attempt to delete files inside our documentDirectory
      if (!uri.startsWith(FileSystem.documentDirectory)) {
        return;
      }
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri);
      }
    } catch (err) {
      // Log and continue; deletion failures are non-fatal for app state
      console.error('safeDelete: failed to delete', uri, err);
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
      throw e;
    }
  };

  const addCat = (newCat, callback) => {
    // Ensure new cat has a unique id and a nextEncounterNumber counter.
    const id = Date.now().toString();
    const nextEncounterNumber =
      (newCat.nextEncounterNumber && Number(newCat.nextEncounterNumber)) ||
      (newCat.encounters && newCat.encounters.length > 0
        ? (Math.max(...newCat.encounters.map((e) => (e.label ? Number(e.label) : 0))) + 1)
        : 1);

    const updatedCats = [
      ...cats,
      { ...newCat, id, nextEncounterNumber },
    ];
    const savePromise = saveCats(updatedCats);
    if (callback) {
      savePromise.then(callback).catch(() => {
        // saveCats already logged the failure; don't invoke the success callback.
      });
    }
    return savePromise;
  };

  const deleteCat = (catId) => {
    const updatedCats = cats.filter((cat) => cat.id !== catId);
    return saveCats(updatedCats);
  };

  const updateCat = (catId, updatedCatData) => {
    const updatedCats = cats.map((cat) =>
      cat.id === catId ? { ...cat, ...updatedCatData } : cat
    );
    return saveCats(updatedCats);
  };

  const addEncounter = (catId, newEncounter) => {
    const updatedCats = cats.map((cat) => {
      if (cat.id === catId) {
        const currentEncounters = cat.encounters || [];

        // Assign an id if not provided
        const encounterId = newEncounter.id || Date.now();

        // Determine label: use provided label if present, otherwise use cat.nextEncounterNumber or compute
        let label = newEncounter.label;
        if (label === undefined || label === null) {
          const next = cat.nextEncounterNumber || (currentEncounters.length > 0
            ? Math.max(...currentEncounters.map((e) => (e.label ? Number(e.label) : 0))) + 1
            : 1);
          label = next;
        }

        // Build the finalized encounter and update the cat's nextEncounterNumber
        const finalizedEncounter = { ...newEncounter, id: encounterId, label };
        const nextEncounterNumber = Math.max((cat.nextEncounterNumber || 1), Number(label) + 1);

        return {
          ...cat,
          encounters: [...currentEncounters, finalizedEncounter],
          nextEncounterNumber,
        };
      }
      return cat;
    });
    return saveCats(updatedCats);
  };


  // Update an existing encounter for a cat
  const updateEncounter = async (catId, encounterId, updatedEncounter) => {
    const deletions = [];
    const updatedCats = cats.map(cat => {
      if (cat.id === catId) {
        const updatedEncounters = (cat.encounters || []).map(item => {
          if (item.id === encounterId) {
            // If the photo changed and the old photo is a local file in our documentDirectory, delete it
            try {
              const oldPhoto = item.photo;
              const newPhoto = updatedEncounter.photo;
              if (
                oldPhoto &&
                newPhoto &&
                oldPhoto !== newPhoto &&
                oldPhoto.startsWith(FileSystem.documentDirectory)
              ) {
                deletions.push(safeDelete(oldPhoto));
              }
            } catch (e) {
              console.error('Error while cleaning up old encounter image:', e);
            }

            return updatedEncounter;
          }
          return item;
        });

        return { ...cat, encounters: updatedEncounters };
      }
      return cat;
    });

    await Promise.all(deletions);
    return saveCats(updatedCats);
  };

  // Add this new function to handle encounter deletion
  const deleteEncounter = async (catId, encounterId) => {
    const deletions = [];
    const updatedCats = cats.map(cat => {
      if (cat.id === catId) {
        const encounterToDelete = (cat.encounters || []).find(item => item.id === encounterId);
        // Remove the encounter from the array
        const updatedEncounters = (cat.encounters || []).filter(
          item => item.id !== encounterId
        );

        // Delete the photo file if it lives in our documentDirectory
        try {
          const photo = encounterToDelete?.photo;
          if (photo && photo.startsWith(FileSystem.documentDirectory)) {
            // Use safeDelete to avoid errors when file is missing
            deletions.push(safeDelete(photo));
          }
        } catch (e) {
          console.error('Error while deleting encounter image:', e);
        }

        return { ...cat, encounters: updatedEncounters };
      }
      return cat;
    });

    await Promise.all(deletions);
    return saveCats(updatedCats);
  };

  // Delete a cat and its stored images
  const deleteCatWithImages = async (catId) => {
    const updatedCats = cats.filter((cat) => cat.id !== catId);

    // Find the cat to delete to remove its images
    const catToDelete = cats.find((c) => c.id === catId);
    if (catToDelete) {
      try {
        const mainImage = catToDelete.imageUri;
        if (mainImage && mainImage.startsWith(FileSystem.documentDirectory)) {
          await safeDelete(mainImage);
        }

        for (const enc of (catToDelete.encounters || [])) {
          const p = enc.photo;
          if (p && p.startsWith(FileSystem.documentDirectory)) {
            await safeDelete(p);
          }
        }
      } catch (e) {
        console.error('Error while cleaning up images for deleted cat:', e);
      }
    }

    return saveCats(updatedCats);
  };

  return (
    <CatContext.Provider
      value={{
        cats,
        loading,
        error,
  addCat,
  // Keep the external API the same: deleteCat will also clean up images
  deleteCat: deleteCatWithImages,
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