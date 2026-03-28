import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme';

export default function NoteCard({ note, onPress, onLongPress }) {
  const { theme } = useTheme();

  const preview = note.content
    ? note.content.substring(0, 100).replace(/\n/g, ' ')
    : '无内容';

  const tags = note.tags
    ? note.tags.split(',').filter(t => t.trim())
    : [];

  const date = new Date(note.updated_at);
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={() => onPress(note)}
      onLongPress={() => onLongPress && onLongPress(note)}
      activeOpacity={0.7}
    >
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {note.title || '无标题'}
      </Text>
      <Text style={[styles.preview, { color: theme.textSecondary }]} numberOfLines={2}>
        {preview}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          {dateStr}
        </Text>
        {tags.length > 0 && (
          <View style={styles.tags}>
            {tags.slice(0, 3).map((tag, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: theme.primary + '20' }]}>
                <Text style={[styles.tagText, { color: theme.primary }]}>{tag.trim()}</Text>
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
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
  },
});
