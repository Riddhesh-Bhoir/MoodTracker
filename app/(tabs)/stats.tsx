import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

export default function StatsScreen() {
  const [moodCounts, setMoodCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const calculateStats = async () => {
      try {
        const data = await AsyncStorage.getItem('moodEntries');
        if (data) {
          const parsed: MoodEntry[] = JSON.parse(data);
          const counts: Record<string, number> = {};
          parsed.forEach(entry => {
            counts[entry.mood] = (counts[entry.mood] || 0) + 1;
          });
          setMoodCounts(counts);
        }
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    };

    calculateStats();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Stats</Text>
      {Object.keys(moodCounts).length === 0 ? (
        <Text>No mood data yet.</Text>
      ) : (
        Object.entries(moodCounts).map(([mood, count]) => (
          <Text key={mood} style={styles.stat}>
            {mood} — {count} time{count > 1 ? 's' : ''}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  stat: { fontSize: 18, marginVertical: 6 },
});
