import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';

export default function QuestScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.monthTitle}>April Quest</Text>
          <Text style={styles.daysCount}>22 DAYS</Text>
          <View style={styles.characterAvatar}>
            <Text style={styles.characterText}>DS</Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Earn 20 Quest Points</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
            <Text style={styles.progressText}>0/20</Text>
          </View>
        </View>

        {/* Friends Quest */}
        <View style={styles.questSection}>
          <Text style={styles.sectionTitle}>FRIENDS QUEST</Text>
          
          <View style={styles.questItem}>
            <View style={styles.questContent}>
              <View style={styles.questIcon}>
                <Text style={styles.iconText}>Follow</Text>
              </View>
              <View style={styles.questDetails}>
                <Text style={styles.questTitle}>Follow your first friend</Text>
                <View style={styles.questProgress}>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: '0%' }]} />
                  </View>
                  <Text style={styles.questProgressText}>0/1</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.questButton}>
              <Text style={styles.questButtonText}>FIND A FRIEND</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Quests */}
        <View style={styles.questSection}>
          <Text style={styles.sectionTitle}>DAILY QUESTS</Text>
          
          {/* Start a streak */}
          <View style={styles.questItem}>
            <View style={styles.questContent}>
              <View style={styles.questIcon}>
                <Text style={styles.iconText}>Streak</Text>
              </View>
              <View style={styles.questDetails}>
                <Text style={styles.questTitle}>Start a streak</Text>
                <View style={styles.questProgress}>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: '0%' }]} />
                  </View>
                  <Text style={styles.questProgressText}>0/1</Text>
                </View>
              </View>
            </View>
            <View style={styles.rewardIcon}>
              <Text style={styles.rewardText}>Chest</Text>
            </View>
          </View>

          {/* Complete 2 lessons */}
          <View style={styles.questItem}>
            <View style={styles.questContent}>
              <View style={styles.questIcon}>
                <Text style={styles.iconText}>Lessons</Text>
              </View>
              <View style={styles.questDetails}>
                <Text style={styles.questTitle}>Complete 2 lessons</Text>
                <View style={styles.questProgress}>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: '0%' }]} />
                  </View>
                  <Text style={styles.questProgressText}>0/2</Text>
                </View>
              </View>
            </View>
            <View style={styles.rewardIcon}>
              <Text style={styles.rewardText}>Chest</Text>
            </View>
          </View>

          {/* Score 90% in 2 lessons */}
          <View style={styles.questItem}>
            <View style={styles.questContent}>
              <View style={styles.questIcon}>
                <Text style={styles.iconText}>Score</Text>
              </View>
              <View style={styles.questDetails}>
                <Text style={styles.questTitle}>Score 90% in 2 lessons</Text>
                <View style={styles.questProgress}>
                  <View style={styles.miniProgressBar}>
                    <View style={[styles.miniProgressFill, { width: '0%' }]} />
                  </View>
                  <Text style={styles.questProgressText}>0/2</Text>
                </View>
              </View>
            </View>
            <View style={styles.rewardIcon}>
              <Text style={styles.rewardText}>Chest</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>Home</Text>
          </View>
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Trophy</Text>
          </View>
          <Text style={[styles.navLabel, styles.inactiveNavText]}>Quest</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Users</Text>
          </View>
          <Text style={[styles.navLabel, styles.inactiveNavText]}>Friends</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Shop</Text>
          </View>
          <Text style={[styles.navLabel, styles.inactiveNavText]}>Shop</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Hearts</Text>
          </View>
          <Text style={[styles.navLabel, styles.inactiveNavText]}>Hearts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Owl</Text>
          </View>
          <Text style={[styles.navLabel, styles.inactiveNavText]}>Profile</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 100, // Space for bottom nav
  },
  header: {
    backgroundColor: '#58CC02',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    alignItems: 'center',
    position: 'relative',
  },
  monthTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  daysCount: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.9,
    marginBottom: 16,
  },
  characterAvatar: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#58A700',
  },
  characterText: {
    color: '#58CC02',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressSection: {
    backgroundColor: '#2C2C2E',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  progressTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#3A3A3C',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 4,
  },
  progressText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
  },
  questSection: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questItem: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  questContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  questIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#3A3A3C',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    color: '#58CC02',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questDetails: {
    flex: 1,
  },
  questTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  questProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#3A3A3C',
    borderRadius: 3,
    overflow: 'hidden',
    maxWidth: 80,
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: '#58CC02',
    borderRadius: 3,
  },
  questProgressText: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
  },
  questButton: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  questButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3A3A3C',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  rewardText: {
    color: '#FF9600',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
    flexDirection: 'row',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#58CC02',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  navLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  inactiveNavIcon: {
    backgroundColor: '#3A3A3C',
  },
  inactiveNavText: {
    color: '#8E8E93',
  },
});
