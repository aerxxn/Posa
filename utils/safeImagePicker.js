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
    delete cleaned.mediaTypes;
  }
  return cleaned;
};

export async function safeLaunchImageLibraryAsync(options) {
  const opts = stripMediaTypes(options);
  return ImagePicker.launchImageLibraryAsync(opts);
}

export async function safeLaunchCameraAsync(options) {
  const opts = stripMediaTypes(options);
  return ImagePicker.launchCameraAsync(opts);
}

export default {
  safeLaunchImageLibraryAsync,
  safeLaunchCameraAsync,
};
