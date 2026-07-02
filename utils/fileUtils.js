import * as FileSystem from 'expo-file-system/legacy';
import { fromByteArray } from 'base64-js';

// Save an image represented by `manipulatedImage` into `dest` with multiple fallbacks.
// manipulatedImage: { uri: string, base64?: string }
export async function saveImageToDest(manipulatedImage, dest) {
  if (!manipulatedImage || !manipulatedImage.uri) {
    throw new Error('Invalid manipulatedImage');
  }

  // 1) Try copyAsync (fast, preserves file)
  try {
    await FileSystem.copyAsync({ from: manipulatedImage.uri, to: dest });
    return dest;
  } catch (e) {
    console.warn('fileUtils.copyAsync failed, trying downloadAsync or base64 fallback', e);
  }

  // 2) Try downloadAsync (works for http(s) and some content:// URIs)
  try {
    const dl = await FileSystem.downloadAsync(manipulatedImage.uri, dest);
    if (dl && (dl.status === 200 || dl.status === 0 || typeof dl.status === 'undefined')) {
      return dest;
    }
  } catch (e) {
    console.warn('fileUtils.downloadAsync failed, will try readAsStringAsync or base64 fallback', e);
  }

  // 3) If manipulator provided base64, write it
  try {
    if (manipulatedImage.base64) {
      const encoding = (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
      await FileSystem.writeAsStringAsync(dest, manipulatedImage.base64, { encoding });
      return dest;
    }
  } catch (e) {
    console.warn('fileUtils.writeAsStringAsync(base64) failed', e);
  }

  // 4) Try reading the source as base64 then write it (works for file:// URIs)
  try {
    const encoding = (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
    const srcBase64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, { encoding });
    if (srcBase64) {
      await FileSystem.writeAsStringAsync(dest, srcBase64, { encoding });
      return dest;
    }
  } catch (e) {
    console.warn('fileUtils.readAsStringAsync failed, last-resort fetch fallback', e);
  }

  // 5) Last resort: try fetch -> arrayBuffer -> base64 and write. This may not work for content:// on all devices,
  // but it's worth trying when other methods fail.
  try {
    const resp = await fetch(manipulatedImage.uri);
    if (!resp.ok && resp.status !== 0) throw new Error('fetch failed: ' + resp.status);
    const arrayBuffer = await resp.arrayBuffer();
    // Convert to base64 using base64-js (reliable across RN environments)
    const bytes = new Uint8Array(arrayBuffer);
    const base64 = fromByteArray(bytes);
    if (!base64) throw new Error('Unable to convert fetch result to base64');
    const encoding = (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
    await FileSystem.writeAsStringAsync(dest, base64, { encoding });
    return dest;
  } catch (e) {
    console.error('fileUtils: final fetch->base64 fallback failed', e);
  }

  throw new Error('Failed to persist image to dest');
}

export default {
  saveImageToDest,
};
