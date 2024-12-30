import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterForm from '../components/RegisterForm';
import { validateEmail, validatePassword } from '../utils/validation';

type RegisterScreenProps = {
  navigation: NavigationProp<any>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');

  const handleRegister = async () => {
    try {
      setError(''); // Clear previous errors
      
      if (!username.trim()) {
        setError('Username is required');
        return;
      }
      
      if (!validateEmail(email)) {
        setError('Invalid email format');
        return;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.some(
        (user: { email: string }) => user.email === email
      );

      if (userExists) {
        setError('User with this email already exists');
        return;
      }

      // Create new user object
      const newUser = {
        username,
        email,
        password, 
        createdAt: new Date().toISOString(),
      };

      // Add new user to users array
      users.push(newUser);

      // Save updated users array
      await AsyncStorage.setItem('users', JSON.stringify(users));

      // Set current user
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));

      Alert.alert(
        'Success',
        'Registration successful!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home') // Navigate to Home screen
          }
        ]
      );

    } catch (error) {
      setError('An error occurred during registration');
      console.error('Registration error:', error);
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
       
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Text style={styles.title}>Sign Up</Text>
      <RegisterForm
        username={username}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        onUsernameChange={setUsername}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleRegister}
      />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RegisterScreen;
