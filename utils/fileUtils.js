import * as FileSystem from 'expo-file-system/legacy';

// Save an image represented by `manipulatedImage` into `dest` with multiple fallbacks.
// manipulatedImage: { uri: string, base64?: string }
export async function saveImageToDest(manipulatedImage, dest) {
  if (!manipulatedImage || !manipulatedImage.uri) {
    throw new Error('Invalid manipulatedImage');
  }

  // Debug logging: show source uri and whether base64 is available
  try {
    console.log('fileUtils.saveImageToDest: saving image', {
      src: manipulatedImage.uri,
      hasBase64: typeof manipulatedImage.base64 === 'string',
      dest,
    });
  } catch (e) {
    /* ignore logging errors */
  }

  // 1) Try copyAsync (fast, preserves file)
  try {
    console.log('fileUtils: attempting copyAsync from', manipulatedImage.uri, 'to', dest);
    await FileSystem.copyAsync({ from: manipulatedImage.uri, to: dest });
    console.log('fileUtils.copyAsync succeeded ->', dest);
    return dest;
  } catch (e) {
    console.warn('fileUtils.copyAsync failed, trying downloadAsync or base64 fallback', e);
  }

  // 2) Try downloadAsync (works for http(s) and some content:// URIs)
  try {
    console.log('fileUtils: attempting downloadAsync from', manipulatedImage.uri, 'to', dest);
    const dl = await FileSystem.downloadAsync(manipulatedImage.uri, dest);
    console.log('fileUtils.downloadAsync result', dl);
    if (dl && (dl.status === 200 || dl.status === 0 || typeof dl.status === 'undefined')) {
      console.log('fileUtils.downloadAsync succeeded ->', dest);
      return dest;
    }
  } catch (e) {
    console.warn('fileUtils.downloadAsync failed, will try readAsStringAsync or base64 fallback', e);
  }

  // 3) If manipulator provided base64, write it
  try {
    if (manipulatedImage.base64) {
      console.log('fileUtils: writing manipulator-provided base64 to', dest);
      const encoding = (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
      await FileSystem.writeAsStringAsync(dest, manipulatedImage.base64, { encoding });
      console.log('fileUtils: writeAsStringAsync(base64) succeeded ->', dest);
      return dest;
    }
  } catch (e) {
    console.warn('fileUtils.writeAsStringAsync(base64) failed', e);
  }

  // 4) Try reading the source as base64 then write it (works for file:// URIs)
  try {
    console.log('fileUtils: trying readAsStringAsync on source', manipulatedImage.uri);
    const encoding = (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
    const srcBase64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, { encoding });
    if (srcBase64) {
      await FileSystem.writeAsStringAsync(dest, srcBase64, { encoding });
      console.log('fileUtils: readAsStringAsync -> writeAsStringAsync succeeded ->', dest);
      return dest;
    }
  } catch (e) {
    console.warn('fileUtils.readAsStringAsync failed, last-resort fetch fallback', e);
  }

  // 5) Last resort: try fetch -> arrayBuffer -> base64 and write. This may not work for content:// on all devices,
  // but it's worth trying when other methods fail.
  try {
    console.log('fileUtils: attempting final fetch->arrayBuffer fallback for', manipulatedImage.uri);
    const resp = await fetch(manipulatedImage.uri);
    if (!resp.ok && resp.status !== 0) throw new Error('fetch failed: ' + resp.status);
    const arrayBuffer = await resp.arrayBuffer();
    // Convert to base64
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    // btoa may not exist in some RN environments; guard accordingly
    const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer && Buffer.from ? Buffer.from(binary, 'binary').toString('base64') : null;
    if (!base64) throw new Error('Unable to convert fetch result to base64');
    const encoding = (FileSystem.EncodingType && FileSystem.EncodingType.Base64) || 'base64';
    await FileSystem.writeAsStringAsync(dest, base64, { encoding });
    console.log('fileUtils: fetch->base64 write succeeded ->', dest);
    return dest;
  } catch (e) {
    console.error('fileUtils: final fetch->base64 fallback failed', e);
  }

  throw new Error('Failed to persist image to dest');
}

export default {
  saveImageToDest,
};
