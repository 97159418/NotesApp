import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { useTheme } from '../theme';
import { exportNotesAsJSON, importNotesFromJSON } from '../utils/export';

export default function Sidebar({ visible, onClose, tags, selectedTag, onSelectTag, onShowAll, onRefresh }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleExport = async () => {
    const ok = await exportNotesAsJSON();
    if (ok) {
      onClose();
    }
  };

  const handleImport = async () => {
    const ok = await importNotesFromJSON();
    if (ok) {
      onRefresh();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.sidebar, { backgroundColor: theme.sidebar }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>备忘录</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeBtn, { color: theme.primary }]}>完成</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>标签</Text>

            <TouchableOpacity
              style={[
                styles.item,
                { backgroundColor: !selectedTag ? theme.primary + '15' : 'transparent' },
              ]}
              onPress={onShowAll}
            >
              <Text style={[styles.itemText, { color: theme.text }]}>全部笔记</Text>
            </TouchableOpacity>

            {tags.map((tag, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.item,
                  { backgroundColor: selectedTag === tag ? theme.primary + '15' : 'transparent' },
                ]}
                onPress={() => onSelectTag(tag)}
              >
                <Text style={[styles.itemText, { color: theme.text }]}># {tag}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.divider} />

            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>设置</Text>

            <TouchableOpacity style={styles.item} onPress={toggleTheme}>
              <Text style={[styles.itemText, { color: theme.text }]}>
                {isDark ? '☀️ 浅色模式' : '🌙 深色模式'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleExport}>
              <Text style={[styles.itemText, { color: theme.text }]}>📤 导出备份</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleImport}>
              <Text style={[styles.itemText, { color: theme.text }]}>📥 导入备份</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sidebar: {
    width: 280,
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  closeBtn: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  itemText: {
    fontSize: 16,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#C6C6C8',
    marginVertical: 16,
  },
});
