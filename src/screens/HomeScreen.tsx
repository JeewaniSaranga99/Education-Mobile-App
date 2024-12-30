import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { useBookContext } from '../context/BookContext';

interface User {
  email: string;
  username: string;
}

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
}

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Register: undefined;
};

const HomeScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { clickCount, incrementCount } = useBookContext();

  useEffect(() => {
    getCurrentUser();
    fetchBooks();
    
    // Set up the header with logout button
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleLogout}
          style={styles.logoutButton}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
      headerTitle: user?.username ? `Welcome, ${user.username}` : 'Home',
    });
  }, [user?.username, navigation]);

  const getCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://openlibrary.org/search.json?subject=education&limit=20'
      );
      const data = await response.json();
      setBooks(data.docs);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => {
    return (
      <TouchableOpacity 
        style={styles.bookItem}
        onPress={() => incrementCount()}
      >
        <Image
          style={styles.bookCover}
          source={{
            uri: item.cover_i
              ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
              : 'https://via.placeholder.com/150x200'
          }}
        />
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>
            {item.author_name ? item.author_name[0] : 'Unknown Author'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Educational Books</Text>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <View style={styles.listContainer}>
            <FlatList
              data={books}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.key}
              style={styles.bookList}
              contentContainerStyle={styles.bookListContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              bounces={true}
              overScrollMode="always"
            />
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.floatingCounter}>
        <Text style={styles.counterText}>Clicks: {clickCount}</Text>
      </TouchableOpacity>
    </View>
  );
};

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logoutButton: {
    marginRight: 15,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  usernameText: {
    fontSize: 16,
    color: '#666',
  },
  bookList: {
    flex: 1,
  },
  bookListContent: {
    paddingBottom: 80,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 4,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    flex: 1,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  floatingCounter: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.04,
    right: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
