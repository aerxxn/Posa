// utils/safeImagePicker.js
// Thin wrapper around expo-image-picker that ensures we never pass
// a `mediaTypes` key to the native module (prevents enum-cast crashes
// observed on some Android versions / picker implementations).
import * as ImagePicker from 'expo-image-picker';

const stripMediaTypes = (opts = {}) => {
  // create shallow copy and remove mediaTypes if present
  if (!opts) return {};
  const cleaned = { ...opts };
  if (Object.prototype.hasOwnProperty.call(cleaned, 'mediaTypes')) {
    // Log defensively to help debug if any code still passes mediaTypes
    console.warn('safeImagePicker: removing mediaTypes from options before calling native picker', cleaned.mediaTypes);
    delete cleaned.mediaTypes;
  }
  return cleaned;
};

export async function safeLaunchImageLibraryAsync(options) {
  // Log the (possibly uncleaned) incoming options to aid debugging on device
  try {
    console.log('safeImagePicker: launchImageLibraryAsync called with options:', options);
  } catch (e) {
    /* ignore logging errors */
  }
  const opts = stripMediaTypes(options);
  console.log('safeImagePicker: calling native launchImageLibraryAsync with options:', opts);
  return ImagePicker.launchImageLibraryAsync(opts);
}

export async function safeLaunchCameraAsync(options) {
  try {
    console.log('safeImagePicker: launchCameraAsync called with options:', options);
  } catch (e) {
    /* ignore logging errors */
  }
  const opts = stripMediaTypes(options);
  console.log('safeImagePicker: calling native launchCameraAsync with options:', opts);
  return ImagePicker.launchCameraAsync(opts);
}

export default {
  safeLaunchImageLibraryAsync,
  safeLaunchCameraAsync,
};
