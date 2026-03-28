import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import {
  getAllNotes,
  searchNotes,
  getNotesByTag,
  deleteNote,
  getAllTags,
} from '../db/database';
import NoteCard from '../components/NoteCard';
import Sidebar from '../components/Sidebar';

export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotes = async () => {
    let result;
    if (search) {
      result = await searchNotes(search);
    } else if (selectedTag) {
      result = await getNotesByTag(selectedTag);
    } else {
      result = await getAllNotes();
    }
    setNotes(result);
    const allTags = await getAllTags();
    setTags(allTags);
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [search, selectedTag])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const handleDelete = (note) => {
    Alert.alert('删除笔记', `确定删除"${note.title || '无标题'}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '删除',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          await loadNotes();
        },
      },
    ]);
  };

  const handleNewNote = () => {
    navigation.navigate('Edit', { noteId: null });
  };

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
    setSearch('');
    setSidebarVisible(false);
  };

  const handleShowAll = () => {
    setSelectedTag(null);
    setSearch('');
    setSidebarVisible(false);
  };

  const noteCount = notes.length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={[styles.menuBtn, { color: theme.primary }]}>☰</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>
          {selectedTag ? `# ${selectedTag}` : '备忘录'}
        </Text>
        <TouchableOpacity onPress={handleNewNote}>
          <Text style={[styles.newBtn, { color: theme.primary }]}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索栏 */}
      <View style={[styles.searchBox, { backgroundColor: theme.searchBg }]}>
        <Text style={[styles.searchIcon, { color: theme.textSecondary }]}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="搜索"
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={(text) => {
            setSearch(text);
            setSelectedTag(null);
          }}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: theme.textSecondary, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 笔记数量 */}
      <Text style={[styles.count, { color: theme.textSecondary }]}>
        {noteCount} 个备忘录
      </Text>

      {/* 笔记列表 */}
      {notes.length === 0 ? (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {search ? '没有找到匹配的备忘录' : '点击 ＋ 创建第一条备忘录'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={(n) => navigation.navigate('Edit', { noteId: n.id })}
              onLongPress={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* 侧栏 */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={handleSelectTag}
        onShowAll={handleShowAll}
        onRefresh={loadNotes}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuBtn: {
    fontSize: 24,
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  newBtn: {
    fontSize: 28,
    fontWeight: '300',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 36,
    marginBottom: 8,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  count: {
    fontSize: 13,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  list: {
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
