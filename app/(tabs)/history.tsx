import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

export default function HistoryScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const data = await AsyncStorage.getItem('moodEntries');
        if (data) {
          const parsed: MoodEntry[] = JSON.parse(data);
          // Sort in descending order by date
          const sorted = parsed.sort((a, b) => b.date.localeCompare(a.date));
          setEntries(sorted);
        }
      } catch (e) {
        console.error('Failed to load entries:', e);
      }
    };

    loadEntries();
  }, []);

  const renderItem = ({ item }: { item: MoodEntry }) => (
    <View style={styles.item}>
      <Text style={styles.mood}>{item.mood}</Text>
      <View style={styles.details}>
        <Text style={styles.date}>{item.date}</Text>
        {item.note ? <Text style={styles.note}>Note: {item.note}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood History</Text>
      <FlatList
        data={entries}
        keyExtractor={(item, index) => item.date + index}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  item: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  mood: { fontSize: 30, marginRight: 15 },
  details: { flex: 1 },
  date: { fontSize: 16, fontWeight: '600' },
  note: { fontSize: 14, color: '#555', marginTop: 5 },
});
