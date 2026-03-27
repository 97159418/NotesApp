import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { exportNotes, importNotes } from '../db/database';

export async function exportToFile() {
  try {
    const notes = await exportNotes();
    const json = JSON.stringify(notes, null, 2);
    const fileUri = FileSystem.documentDirectory + 'notes-export.json';
    await FileSystem.writeAsStringAsync(fileUri, json);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: '导出笔记'
      });
    }
    return true;
  } catch (e) {
    console.error('Export failed:', e);
    return false;
  }
}

export async function importFromFile() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });
    
    if (result.canceled) return false;
    
    const content = await FileSystem.readAsStringAsync(result.assets[0].uri);
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) throw new Error('Invalid format');
    
    await importNotes(data);
    return true;
  } catch (e) {
    console.error('Import failed:', e);
    return false;
  }
}
