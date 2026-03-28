import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { getNoteById, createNote, updateNote } from '../db/database';
import TagEditor from '../components/TagEditor';

export default function EditScreen({ route, navigation }) {
  const { theme } = useTheme();
  const { noteId } = route.params;
  const isNew = !noteId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const contentRef = useRef(null);

  // 加载已有笔记
  useEffect(() => {
    if (noteId) {
      getNoteById(noteId).then((note) => {
        if (note) {
          setTitle(note.title);
          setContent(note.content);
          setTags(note.tags);
        }
      });
    }
  }, [noteId]);

  const markChanged = () => {
    if (!hasChanges) setHasChanges(true);
  };

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      // 空笔记直接返回
      navigation.goBack();
      return;
    }

    try {
      if (isNew) {
        await createNote(trimmedTitle, trimmedContent, tags);
      } else {
        await updateNote(noteId, trimmedTitle, trimmedContent, tags);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('保存失败', e.message);
    }
  };

  const handleBack = () => {
    if (hasChanges) {
      Alert.alert('未保存', '是否放弃更改？', [
        { text: '继续编辑', style: 'cancel' },
        { text: '放弃', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      {/* 顶栏 */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={[styles.backBtn, { color: theme.primary }]}>← 返回</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveBtn, { color: theme.primary }]}>完成</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.editor} keyboardDismissMode="on-drag">
          {/* 标签编辑 */}
          <TagEditor tags={tags} onChangeTags={(t) => { setTags(t); markChanged(); }} />

          {/* 标题 */}
          <TextInput
            style={[styles.titleInput, { color: theme.text }]}
            placeholder="标题"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={(t) => { setTitle(t); markChanged(); }}
            multiline
            maxLength={100}
          />

          {/* 内容 */}
          <TextInput
            ref={contentRef}
            style={[styles.contentInput, { color: theme.text }]}
            placeholder="开始输入..."
            placeholderTextColor={theme.textSecondary}
            value={content}
            onChangeText={(t) => { setContent(t); markChanged(); }}
            multiline
            textAlignVertical="top"
            autoFocus={isNew}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    fontSize: 16,
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: '600',
  },
  editor: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 32,
  },
  contentInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 300,
    paddingBottom: 100,
  },
});
