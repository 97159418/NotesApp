import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme';

export default function TagEditor({ tags, onChangeTags }) {
  const { theme } = useTheme();
  const [input, setInput] = useState('');

  const tagList = tags
    ? tags.split(',').filter(t => t.trim())
    : [];

  const addTag = () => {
    const newTag = input.trim();
    if (!newTag) return;
    if (tagList.includes(newTag)) {
      setInput('');
      return;
    }
    const updated = [...tagList, newTag].join(',');
    onChangeTags(updated);
    setInput('');
  };

  const removeTag = (tag) => {
    const updated = tagList.filter(t => t !== tag).join(',');
    onChangeTags(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>标签</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.searchBg, color: theme.text, borderColor: theme.border }]}
          placeholder="添加标签..."
          placeholderTextColor={theme.textSecondary}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTag}
          returnKeyType="done"
        />
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={addTag}
        >
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagList}>
        {tagList.map((tag, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tag, { backgroundColor: theme.primary + '20' }]}
            onPress={() => removeTag(tag)}
          >
            <Text style={[styles.tagText, { color: theme.primary }]}>
              {tag} ×
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    borderWidth: 0.5,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  tagList: {
    flexDirection: 'row',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    fontSize: 13,
  },
});
