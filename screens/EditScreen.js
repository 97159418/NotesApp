import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import TagEditor from '../components/TagEditor';
import { getNote, createNote, updateNote, deleteNote } from '../db/database';

export default function EditScreen({ route, navigation }) {
  const { noteId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [dark] = useState(true);
  const contentRef = useRef(null);

  const colors = dark ? {
    bg: '#1c1c1e', text: '#f5f5f7', text2: '#98989d',
    border: '#38383a', accent: '#0a84ff', toolbarBg: '#2c2c2e'
  } : {
    bg: '#fff', text: '#1d1d1f', text2: '#86868b',
    border: '#d2d2d7', accent: '#007aff', toolbarBg: '#f5f5f7'
  };

  useEffect(() => {
    if (noteId) {
      getNote(noteId).then(note => {
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setTags(note.tags);
        }
      });
    }
  }, [noteId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={handleSave}>
            <Text style={{ color: colors.accent, fontSize: 15, fontWeight: '600' }}>保存</Text>
          </TouchableOpacity>
          {noteId && (
            <TouchableOpacity onPress={handleDelete}>
              <Text style={{ color: '#ff3b30', fontSize: 15 }}>删除</Text>
            </TouchableOpacity>
          )}
        </View>
      ),
      headerStyle: { backgroundColor: colors.toolbarBg },
      headerTintColor: colors.accent,
      title: noteId ? '编辑笔记' : '新建笔记',
    });
  }, [title, content, tags, noteId]);

  const handleSave = async () => {
    if (noteId) {
      await updateNote(noteId, title, content, tags);
    } else {
      await createNote(title, content, tags);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('删除笔记', '确定要删除吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '删除', style: 'destructive',
        onPress: async () => { await deleteNote(noteId); navigation.goBack(); }
      }
    ]);
  };

  const handleAddTag = (tag) => setTags([...tags, tag]);
  const handleRemoveTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <TextInput
        style={[styles.titleInput, { color: colors.text }]}
        placeholder="标题"
        placeholderTextColor={colors.text2}
        value={title}
        onChangeText={setTitle}
        fontSize={22}
        fontWeight="700"
      />

      <TagEditor tags={tags} onAdd={handleAddTag} onRemove={handleRemoveTag} colors={colors} />

      <TextInput
        ref={contentRef}
        style={[styles.contentInput, { color: colors.text }]}
        placeholder="开始输入..."
        placeholderTextColor={colors.text2}
        value={content}
        onChangeText={setContent}
        multiline
        textAlignVertical="top"
        fontSize={16}
        lineHeight={24}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  titleInput: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  contentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    fontSize: 16,
  },
});
