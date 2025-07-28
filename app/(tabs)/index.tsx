import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

interface MoodEntry {
  date: string;
  mood: string;
  note?: string;
}

export default function HomeScreen() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todayLogged, setTodayLogged] = useState(false);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadMoods = async () => {
        try {
          const data = await AsyncStorage.getItem('moodEntries');
          const parsed: MoodEntry[] = data ? JSON.parse(data) : [];

          const today = format(new Date(), 'yyyy-MM-dd');
          const hasTodayEntry = parsed.some((entry) => entry.date === today);

          setMoodEntries(parsed.reverse());
          setTodayLogged(hasTodayEntry);
        } catch (err) {
          console.error('Failed to load mood entries', err);
        }
      };

      loadMoods();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mood Tracker</Text>

      <TouchableOpacity
        style={[styles.button, todayLogged && styles.buttonDisabled]}
        disabled={todayLogged}
        onPress={() => navigation.navigate('log' as never)}
      >
        <Text style={styles.buttonText}>
          {todayLogged ? "Today's Mood Added" : 'Log Today’s Mood'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Recent Entries</Text>

      {moodEntries.length === 0 ? (
        <Text style={styles.noEntry}>No moods logged yet.</Text>
      ) : (
        <FlatList
          data={moodEntries}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.entry}>
              <Text style={styles.mood}>{item.mood}</Text>
              <Text style={styles.date}>{item.date}</Text>
              {item.note ? <Text style={styles.note}>Note: {item.note}</Text> : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 20 },
  noEntry: { fontStyle: 'italic', marginTop: 10 },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  entry: {
    marginTop: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  mood: { fontSize: 24 },
  date: { fontSize: 14, color: '#666' },
  note: { marginTop: 4, fontStyle: 'italic', color: '#333' },
});
