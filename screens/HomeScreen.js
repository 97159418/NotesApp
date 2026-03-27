import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Alert, ScrollView
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NoteCard from '../components/NoteCard';
import { getAllNotes, searchNotes, getNotesByTag, deleteNote, getAllTags } from '../db/database';
import { exportToFile, importFromFile } from '../utils/export';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [dark, setDark] = useState(true);

  const colors = dark ? {
    bg: '#1c1c1e', sidebarBg: '#2c2c2e', cardBg: '#2c2c2e',
    text: '#f5f5f7', text2: '#98989d', border: '#38383a',
    accent: '#0a84ff', selected: '#0a84ff', searchBg: '#3a3a3c'
  } : {
    bg: '#f5f5f7', sidebarBg: '#fff', cardBg: '#fff',
    text: '#1d1d1f', text2: '#86868b', border: '#d2d2d7',
    accent: '#007aff', selected: '#007aff', searchBg: '#e5e5ea'
  };

  const loadNotes = async () => {
    let result;
    if (search) {
      result = await searchNotes(search);
    } else if (activeTag) {
      result = await getNotesByTag(activeTag);
    } else {
      result = await getAllNotes();
    }
    setNotes(result);
    const allTags = await getAllTags();
    setTags(allTags);
  };

  useFocusEffect(useCallback(() => { loadNotes(); }, [search, activeTag]));

  const handleDelete = (id) => {
    Alert.alert('删除笔记', '确定要删除这条笔记吗？', [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => { await deleteNote(id); loadNotes(); } }
    ]);
  };

  const handleImport = async () => {
    const ok = await importFromFile();
    if (ok) { loadNotes(); Alert.alert('成功', '导入完成'); }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.sidebarBg, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>记事本</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity onPress={() => navigation.navigate('Edit', { noteId: null })}>
            <Text style={[styles.btn, { color: colors.accent }]}>＋</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={exportToFile}>
            <Text style={[styles.btnText, { color: colors.text2 }]}>导出</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleImport}>
            <Text style={[styles.btnText, { color: colors.text2 }]}>导入</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setDark(!dark)}>
            <Text style={styles.btn}>{dark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.search, { backgroundColor: colors.searchBg, color: colors.text }]}
          placeholder="搜索笔记..."
          placeholderTextColor={colors.text2}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Tags */}
      {tags.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsBar} contentContainerStyle={styles.tagsContent}>
          <TouchableOpacity
            style={[styles.tagBtn, { borderColor: colors.border }, !activeTag && { backgroundColor: colors.accent, borderColor: colors.accent }]}
            onPress={() => setActiveTag(null)}
          >
            <Text style={[styles.tagBtnText, { color: !activeTag ? '#fff' : colors.text2 }]}>全部</Text>
          </TouchableOpacity>
          {tags.map((tag, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.tagBtn, { borderColor: colors.border }, activeTag === tag && { backgroundColor: colors.accent, borderColor: colors.accent }]}
              onPress={() => setActiveTag(activeTag === tag ? null : tag)}
            >
              <Text style={[styles.tagBtnText, { color: activeTag === tag ? '#fff' : colors.text2 }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => navigation.navigate('Edit', { noteId: item.id })}
            onLongPress={() => handleDelete(item.id)}
            colors={colors}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.text2 }]}>
              {search ? '没有找到笔记' : '点击 ＋ 新建笔记'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerBtns: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  btn: { fontSize: 22 },
  btnText: { fontSize: 13 },
  searchRow: { paddingHorizontal: 12, paddingVertical: 8 },
  search: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, fontSize: 14 },
  tagsBar: { maxHeight: 36, paddingHorizontal: 12 },
  tagsContent: { gap: 6, paddingVertical: 4 },
  tagBtn: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, borderWidth: 1 },
  tagBtnText: { fontSize: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { fontSize: 15 },
});
