import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginForm from '../components/LoginForm';

type LoginScreenProps = {
  navigation: NavigationProp<any>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleLogin = async () => {
    try {
      console.log('Login attempt with:', email, password);
      setError('');

      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password');
        return;
      }

      const usersJson = await AsyncStorage.getItem('users');
      console.log('Users from storage:', usersJson);

      if (!usersJson) {
        setError('No users found');
        return;
      }

      const users = JSON.parse(usersJson);
      console.log('Parsed users:', users);

      const user = users.find(
        (u: { email: string; password: string }) => 
          u.email.toLowerCase() === email.toLowerCase() && 
          u.password === password
      );

      console.log('Found user:', user);

      if (!user) {
        setError('Invalid email or password');
        return;
      }

      // Set current user
      await AsyncStorage.setItem('currentUser', JSON.stringify(user));

      // Clear form
      setEmail('');
      setPassword('');

      // Navigate immediately without Alert
      navigation.navigate('Home', { 
        username: user.username 
      });

    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logo.jpg')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>JS ACADEMY</Text>
        <Text style={styles.tagline}>Learn Anywhere, Grow Everywhere!</Text>
        <Text style={styles.educationalMessage}>
          "Unlock your potential with knowledge. Start your journey today!"
        </Text>
      </View>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <LoginForm
        email={email}
        password={password}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleLogin}
      />
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupLink}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginTop: 5,
  },
  educationalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#333',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
