import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function TagEditor({ tags, onAdd, onRemove, colors }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const tag = input.trim();
    if (tag && !tags.includes(tag)) {
      onAdd(tag);
    }
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.tagsRow}>
        {tags.map((tag, i) => (
          <View key={i} style={[styles.tag, { backgroundColor: 'rgba(0,122,255,0.15)' }]}>
            <Text style={[styles.tagText, { color: colors.accent }]}>{tag}</Text>
            <TouchableOpacity onPress={() => onRemove(i)} hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
              <Text style={[styles.remove, { color: colors.accent }]}> ×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder="添加标签..."
          placeholderTextColor={colors.text2}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          blurOnSubmit={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
  },
  remove: {
    fontSize: 14,
  },
  input: {
    fontSize: 12,
    minWidth: 70,
    paddingVertical: 2,
  },
});
