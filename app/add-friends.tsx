import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function AddFriendsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>×</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Add friends</Text>
        
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Follow your friends to see their progress on your leaderboard
        </Text>

        {/* Add Friends Options */}
        <View style={styles.optionsContainer}>
          {/* Choose from contacts */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Text style={styles.iconText}>Contacts</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Choose from contacts</Text>
                <Text style={styles.optionDescription}>Find friends who are already on Duolingo</Text>
              </View>
            </View>
            <View style={styles.arrowIcon}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          {/* Search by name */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Text style={styles.iconText}>Search</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Search by name</Text>
                <Text style={styles.optionDescription}>Search for friends by their Duolingo username</Text>
              </View>
            </View>
            <View style={styles.arrowIcon}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </View>
          </TouchableOpacity>

          {/* Share follow link */}
          <TouchableOpacity style={styles.optionCard}>
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Text style={styles.iconText}>Share</Text>
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>Share follow link</Text>
                <Text style={styles.optionDescription}>Invite friends to follow you on Duolingo</Text>
              </View>
            </View>
            <View style={styles.arrowIcon}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Invite Friends Section */}
        <View style={styles.inviteSection}>
          <Text style={styles.inviteTitle}>Invite friends</Text>
          <Text style={styles.inviteSubtitle}>
            Each friend you invite gets you extra XP when they make progress!
          </Text>
          
          {/* Share Link Button */}
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>SHARE YOUR LINK</Text>
          </TouchableOpacity>
          
          {/* Social Share Options */}
          <View style={styles.socialOptions}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    marginBottom: 32,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionCard: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#58CC02',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  arrowIcon: {
    marginLeft: 16,
  },
  arrowText: {
    fontSize: 20,
    color: '#8E8E93',
    fontWeight: 'bold',
  },
  inviteSection: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 40,
  },
  inviteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  inviteSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    marginBottom: 24,
  },
  shareButton: {
    backgroundColor: '#58CC02',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialOptions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  socialButton: {
    backgroundColor: '#3A3A3C',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  socialText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
