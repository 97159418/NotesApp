import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function NoteCard({ note, isSelected, onPress, colors }) {
  const formatDate = (ts) => {
    const d = new Date(ts);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${mm}-${dd} ${h}:${m}`;
  };

  const preview = note.content.replace(/<[^>]+>/g, '').substring(0, 60);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isSelected ? colors.selected : colors.cardBg, borderBottomColor: colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, { color: isSelected ? '#fff' : colors.text }]} numberOfLines={1}>
        {note.title || '无标题'}
      </Text>
      <Text style={[styles.preview, { color: isSelected ? 'rgba(255,255,255,0.7)' : colors.text2 }]} numberOfLines={1}>
        {preview || '空笔记'}
      </Text>
      <View style={styles.meta}>
        <Text style={[styles.date, { color: isSelected ? 'rgba(255,255,255,0.6)' : colors.text2 }]}>
          {formatDate(note.updated_at)}
        </Text>
        {note.tags.length > 0 && (
          <View style={styles.tags}>
            {note.tags.slice(0, 2).map((tag, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,122,255,0.15)' }]}>
                <Text style={[styles.tagText, { color: isSelected ? '#fff' : colors.accent }]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  preview: {
    fontSize: 13,
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 11,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
  },
});
