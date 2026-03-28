import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { exportAllNotes, importNotes } from '../db/database';

// 导出笔记为 JSON 文件
export async function exportNotesAsJSON() {
  try {
    const notes = await exportAllNotes();
    const json = JSON.stringify(notes, null, 2);
    const fileUri = FileSystem.documentDirectory + 'notes_backup.json';
    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: '导出备忘录',
      });
    }
    return true;
  } catch (e) {
    console.error('导出失败:', e);
    return false;
  }
}

// 从 JSON 文件导入笔记
export async function importNotesFromJSON() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) return false;

    const content = await FileSystem.readAsStringAsync(result.assets[0].uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const notes = JSON.parse(content);
    if (!Array.isArray(notes)) {
      throw new Error('格式错误：不是有效的笔记数组');
    }

    await importNotes(notes);
    return true;
  } catch (e) {
    console.error('导入失败:', e);
    return false;
  }
}
