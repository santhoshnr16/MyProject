import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function CustomizeUsernameScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('SANTHOSHSA483388');

  const handleContinue = () => {
    if (username.trim()) {
      // Navigate back to profile or next step
      router.back();
    } else {
      Alert.alert('Error', 'Please enter a username');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>×</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>Customize your username</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your username is unique and identifies you on Duolingo. You can only change it once.
        </Text>

        {/* Username Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.atSymbol}>@</Text>
          <TextInput
            style={styles.usernameInput}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#8E8E93"
            maxLength={15}
            autoCapitalize="none"
          />
        </View>

        {/* Character Count */}
        <Text style={styles.characterCount}>{username.length}/15</Text>

        {/* Info Text */}
        <Text style={styles.infoText}>
          Your username must be 2-15 characters long and can contain letters, numbers, underscores, and hyphens.
        </Text>

        {/* Continue Button */}
        <TouchableOpacity 
          style={[styles.continueButton, username.trim() ? styles.continueButtonActive : styles.continueButtonInactive]}
          onPress={handleContinue}
          disabled={!username.trim()}
        >
          <Text style={[styles.continueButtonText, username.trim() ? styles.continueButtonTextActive : styles.continueButtonTextInactive]}>
            CONTINUE
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
  },
  atSymbol: {
    fontSize: 20,
    color: '#8E8E93',
    marginRight: 8,
    fontWeight: '500',
  },
  usernameInput: {
    flex: 1,
    fontSize: 20,
    color: '#fff',
    fontWeight: '500',
    padding: 0,
  },
  characterCount: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'right',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 40,
  },
  continueButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  continueButtonActive: {
    backgroundColor: '#58CC02',
  },
  continueButtonInactive: {
    backgroundColor: '#3A3A3C',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  continueButtonTextActive: {
    color: '#fff',
  },
  continueButtonTextInactive: {
    color: '#8E8E93',
  },
});
