import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Text style={styles.timeText}>1:39</Text>
          <View style={styles.networkIcons}>
            <Text style={styles.iconText}>5G</Text>
            <Text style={styles.iconText}>WiFi</Text>
            <Text style={styles.batteryText}>6%</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.userName}>Santhosh Santhu</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Text style={styles.profileIcon}>+</Text>
          </View>
          <View style={styles.dashedBorder} />
        </View>

        {/* User Details */}
        <View style={styles.userDetails}>
          <Text style={styles.username}>@SANTHOSHSA483388</Text>
          <Text style={styles.joinDate}>JOINED 2026</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-friends')}>
            <Text style={styles.addIcon}>+</Text>
            <Text style={styles.addText}>ADD FRIENDS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridButton}>
            <Text style={styles.gridIcon}>Grid</Text>
          </TouchableOpacity>
        </View>

        {/* Complete Profile Banner */}
        <View style={styles.completeProfileBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Finish your profile!</Text>
              <Text style={styles.bannerSubtitle}>1 STEP LEFT</Text>
              <TouchableOpacity style={styles.completeButton} onPress={() => router.push('/customize-username')}>
                <Text style={styles.completeButtonText}>COMPLETE PROFILE</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bannerRight}>
              <View style={styles.owlContainer}>
                <View style={styles.owlBody}>
                  <View style={styles.owlBelly} />
                  <View style={styles.eyesContainer}>
                    <View style={styles.eye}>
                      <View style={styles.pupil} />
                    </View>
                    <View style={styles.eye}>
                      <View style={styles.pupil} />
                    </View>
                  </View>
                  <View style={styles.beak} />
                  <View style={[styles.wing, styles.leftWing]} />
                  <View style={[styles.wing, styles.rightWing]} />
                </View>
                <View style={styles.paper}>
                  <Text style={styles.paperText}>Profile</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Overview Section */}
        <View style={styles.overviewSection}>
          <Text style={styles.sectionTitle}>OVERVIEW</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>Flame</Text>
              <View>
                <Text style={styles.overviewLabel}>Current Streak</Text>
                <Text style={styles.overviewValue}>0 days</Text>
              </View>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>Flag</Text>
              <View>
                <Text style={styles.overviewLabel}>Lingots</Text>
                <Text style={styles.overviewValue}>60</Text>
              </View>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>Shield</Text>
              <View>
                <Text style={styles.overviewLabel}>Streak Shield</Text>
                <Text style={styles.overviewValue}>No current</Text>
              </View>
            </View>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewIcon}>Bolt</Text>
              <View>
                <Text style={styles.overviewLabel}>Total XP</Text>
                <Text style={styles.overviewValue}>78 XP</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Friend Streaks */}
        <View style={styles.friendStreaksSection}>
          <Text style={styles.sectionTitle}>FRIEND STREAKS</Text>
          <View style={styles.friendStreaksGrid}>
            <TouchableOpacity style={styles.friendStreakItem}>
              <View style={styles.friendCircle}>
                <Text style={styles.friendPlus}>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.friendStreakItem}>
              <View style={styles.friendCircle}>
                <Text style={styles.friendPlus}>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.friendStreakItem}>
              <View style={styles.friendCircle}>
                <Text style={styles.friendPlus}>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.friendStreakItem}>
              <View style={styles.friendCircle}>
                <Text style={styles.friendPlus}>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.friendStreakItem}>
              <View style={styles.friendCircle}>
                <Text style={styles.friendPlus}>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.friendStreakItem}>
              <View style={styles.friendCircle}>
                <Text style={styles.friendPlus}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>Home</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Trophy</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Shop</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Hearts</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>Owl</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={[styles.navIcon, styles.inactiveNavIcon]}>
            <Text style={[styles.navIconText, styles.inactiveNavText]}>...</Text>
          </View>
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
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2C2C2E',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  networkIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  batteryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  settingsIcon: {
    color: '#58CC02',
    fontSize: 14,
    fontWeight: '600',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    backgroundColor: '#58CC02',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  dashedBorder: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#58CC02',
    borderStyle: 'dashed',
  },
  userDetails: {
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    color: '#58CC02',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  joinDate: {
    color: '#8E8E93',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#2C2C2E',
    paddingVertical: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#8E8E93',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#58CC02',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  gridButton: {
    width: 50,
    height: 50,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    color: '#8E8E93',
    fontSize: 16,
  },
  completeProfileBanner: {
    backgroundColor: '#58CC02',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerLeft: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  completeButtonText: {
    color: '#58CC02',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bannerRight: {
    marginLeft: 20,
  },
  owlContainer: {
    position: 'relative',
  },
  owlBody: {
    width: 60,
    height: 60,
    backgroundColor: '#58CC02',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#58A700',
    position: 'relative',
  },
  owlBelly: {
    position: 'absolute',
    bottom: 8,
    width: 40,
    height: 30,
    backgroundColor: '#89E219',
    borderRadius: 20,
  },
  eyesContainer: {
    position: 'absolute',
    top: 12,
    flexDirection: 'row',
    gap: 10,
  },
  eye: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pupil: {
    width: 7,
    height: 7,
    backgroundColor: '#000',
    borderRadius: 3.5,
  },
  beak: {
    position: 'absolute',
    top: 28,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF9600',
  },
  wing: {
    position: 'absolute',
    width: 15,
    height: 22,
    backgroundColor: '#58A700',
    borderRadius: 7,
    top: 22,
  },
  leftWing: {
    left: -6,
    transform: [{ rotate: '-15deg' }],
  },
  rightWing: {
    right: -6,
    transform: [{ rotate: '15deg' }],
  },
  paper: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 20,
    height: 25,
    backgroundColor: '#fff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paperText: {
    color: '#58CC02',
    fontSize: 8,
    fontWeight: 'bold',
  },
  overviewSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  overviewGrid: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  overviewIcon: {
    color: '#58CC02',
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  overviewLabel: {
    color: '#8E8E93',
    fontSize: 12,
    marginBottom: 2,
  },
  overviewValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  friendStreaksSection: {
    marginBottom: 30,
  },
  friendStreaksGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  friendStreakItem: {
    marginBottom: 8,
  },
  friendCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#58CC02',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
  friendPlus: {
    color: '#58CC02',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#58CC02',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navIconText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inactiveNavIcon: {
    backgroundColor: '#3A3A3C',
  },
  inactiveNavText: {
    color: '#8E8E93',
  },
});
