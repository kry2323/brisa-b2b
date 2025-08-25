import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

// Saves an app-bundled PDF (required via Metro) to a user-accessible location.
// moduleRef must be a static require('...pdf') so Metro bundles it.
export const downloadBundledPdf = async (moduleRef: number, suggestedFileName?: string): Promise<string> => {
  const asset = Asset.fromModule(moduleRef);
  await asset.downloadAsync();
  const sourceUri = asset.localUri || asset.uri;
  if (!sourceUri) {
    throw new Error('PDF asset not available');
  }

  const fileNameGuess = suggestedFileName || (asset.name?.endsWith('.pdf') ? asset.name : `${asset.name || 'file'}.pdf`);

  // Copy into app documents first
  const tmpDest = `${FileSystem.documentDirectory}${fileNameGuess}`;
  await FileSystem.copyAsync({ from: sourceUri, to: tmpDest });

  if (Platform.OS === 'android') {
    // Ask for a directory (e.g., Downloads) and write the file there
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (permissions.granted) {
      const dirUri = permissions.directoryUri;
      const safFileUri = await FileSystem.StorageAccessFramework.createFileAsync(dirUri, fileNameGuess, 'application/pdf');
      const base64 = await FileSystem.readAsStringAsync(tmpDest, { encoding: FileSystem.EncodingType.Base64 });
      await FileSystem.writeAsStringAsync(safFileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      // Also offer share so user can quickly open/send the file
      try {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(safFileUri, { dialogTitle: 'Share PDF', UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
        }
      } catch {}
      return safFileUri;
    }
  }
  // No SAF or non-Android: show share dialog so user can save/export
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(tmpDest, { dialogTitle: 'Share PDF', UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
    }
  } catch {}
  return tmpDest;
};


