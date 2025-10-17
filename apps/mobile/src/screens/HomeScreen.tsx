import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';

const MOCK_ANIME = [
  { id: '1', title: 'Attack on Titan', rating: 9.0 },
  { id: '2', title: 'Demon Slayer', rating: 8.7 },
  { id: '3', title: 'My Hero Academia', rating: 8.4 },
  { id: '4', title: 'One Piece', rating: 8.9 },
];

export default function HomeScreen({ navigation }: any) {
  const renderAnimeCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Player', { animeId: item.id })}
    >
      <View style={styles.thumbnail}>
        <Text style={styles.placeholderText}>🎬</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardRating}>⭐ {item.rating}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Trending Now</Text>
      </View>

      <FlatList
        data={MOCK_ANIME}
        renderItem={renderAnimeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  grid: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    aspectRatio: 2 / 3,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  cardRating: {
    color: '#888',
    fontSize: 14,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
});
