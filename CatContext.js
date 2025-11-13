// CatContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { AppState } from 'react-native';
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

        // Cleanup any orphaned images that are stored in our documentDirectory but no longer
        // referenced by any cat or encounter. This helps reclaim storage when deletes failed
        // previously or files were left behind.
        try {
          await cleanupOrphanImages(parsed);
        } catch (e) {
          console.error('Failed to cleanup orphan images on load:', e);
        }

        setCats(parsed);
      }
    } catch (e) {
      console.error("Failed to load cats from storage", e);
      setError("Failed to load your cats. Please restart the app.");
    } finally {
      setLoading(false);
    }
  };

  // Remove files in documentDirectory/posa_images that are not referenced by any cat or encounter
  async function cleanupOrphanImages(loadedCats) {
    try {
      const dir = `${FileSystem.documentDirectory}posa_images/`;
      const info = await FileSystem.getInfoAsync(dir);
      if (!info.exists) return;

      const files = await FileSystem.readDirectoryAsync(dir);
      if (!files || files.length === 0) return;

      const referenced = new Set();
      (loadedCats || []).forEach((cat) => {
        if (cat.imageUri) referenced.add(cat.imageUri);
        (cat.encounters || []).forEach((enc) => {
          if (enc.photo) referenced.add(enc.photo);
        });
      });

      for (const filename of files) {
        const full = `${dir}${filename}`;
        if (!referenced.has(full)) {
          try {
            await FileSystem.deleteAsync(full);
            console.log('Removed orphan image:', full);
          } catch (e) {
            console.error('Failed to delete orphan image', full, e);
          }
        }
      }
    } catch (e) {
      console.error('Error while cleaning up orphan images:', e);
    }
  };

  // Safe delete helper: check existence before trying to delete to avoid "file not found" errors
  const safeDelete = async (uri) => {
    try {
      if (!uri) return;
      // Only attempt to delete files inside our documentDirectory
      if (!uri.startsWith(FileSystem.documentDirectory)) {
        console.log('safeDelete: skipping non-documentDirectory uri', uri);
        return;
      }
      const info = await FileSystem.getInfoAsync(uri);
      if (info.exists) {
        await FileSystem.deleteAsync(uri);
        console.log('safeDelete: deleted', uri);
      } else {
        console.log('safeDelete: file not found, skipping delete for', uri);
      }
    } catch (err) {
      // Log and continue; deletion failures are non-fatal for app state
      console.error('safeDelete: failed to delete', uri, err);
    }
  };

  useEffect(() => {
    loadCats();
  }, []);

  // Run orphan cleanup whenever the app comes to the foreground so cleanup happens
  // automatically and silently without notifying the user.
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        try {
          cleanupOrphanImages(cats);
        } catch (e) {
          console.error('Error running orphan cleanup on app foreground:', e);
        }
      }
    };

    // RN >=0.65 returns a subscription with remove(), older versions use removeEventListener
    const sub = AppState.addEventListener ? AppState.addEventListener('change', handleAppStateChange) : null;
    if (!sub) {
      // fallback for older RN
      AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      try {
        if (sub && sub.remove) sub.remove();
        else AppState.removeEventListener('change', handleAppStateChange);
      } catch (e) {
        // ignore
      }
    };
  }, [cats]);

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
    saveCats(updatedCats);
  };


  // Update an existing encounter for a cat
  const updateEncounter = (catId, encounterId, updatedEncounter) => {
    const updatedCats = cats.map(cat => {
      if (cat.id === catId) {
        const updatedEncounters = cat.encounters.map(item => {
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
                  // Use safeDelete helper to avoid exceptions when file is already gone
                  safeDelete(oldPhoto);
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

    saveCats(updatedCats);
  };

  // Add this new function to handle encounter deletion
  const deleteEncounter = (catId, encounterId) => {
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
            safeDelete(photo);
          }
        } catch (e) {
          console.error('Error while deleting encounter image:', e);
        }

        return { ...cat, encounters: updatedEncounters };
      }
      return cat;
    });
    saveCats(updatedCats);
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

    saveCats(updatedCats);
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