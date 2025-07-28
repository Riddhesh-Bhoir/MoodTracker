import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

const MOODS = ['😊', '😐', '😢', '😠', '😴'];

export default function LogMoodScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const router = useRouter();

  const saveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood');
      return;
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const existing = await AsyncStorage.getItem('moodEntries');
      const parsed = existing ? JSON.parse(existing) : [];

      // Prevent multiple entries for the same day
      const alreadyLogged = parsed.some((entry: any) => entry.date === today);
      if (alreadyLogged) {
        Alert.alert('Mood already logged for today');
        return;
      }

      const newEntry = {
        date: today,
        mood: selectedMood,
        note: note.trim(),
      };

      await AsyncStorage.setItem(
        'moodEntries',
        JSON.stringify([...parsed, newEntry])
      );

      router.replace('/');
    } catch (e) {
      console.error('Error saving mood:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodContainer}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood}
            style={[
              styles.moodButton,
              selectedMood === mood && styles.selectedMood,
            ]}
            onPress={() => setSelectedMood(mood)}
          >
            <Text style={styles.moodText}>{mood}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        placeholder="Optional note..."
        style={styles.noteInput}
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
        <Text style={styles.saveText}>Save Mood</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  moodButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  selectedMood: {
    backgroundColor: '#a2d2ff',
  },
  moodText: { fontSize: 30 },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontSize: 16 },
});
