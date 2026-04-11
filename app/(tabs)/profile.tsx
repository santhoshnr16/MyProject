import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import DuoBird from '../../components/DuoBird';
import { AppColors } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Options */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => {}}>
            <Text style={styles.iconEmoji}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>👨‍💻</Text>
            <View style={styles.dashedBorder} />
          </View>
          <Text style={styles.userName}>Santhosh Santhu</Text>
          <Text style={styles.userHandle}>@santhosh_dev</Text>
          <Text style={styles.joinDate}>Joined April 2026</Text>
        </View>

        {/* Following Stats */}
        <View style={styles.followingStats}>
          <View style={styles.followingStatItem}>
            <Text style={styles.followingStatNumber}>42</Text>
            <Text style={styles.followingStatLabel}>Following</Text>
          </View>
          <View style={styles.followingDivider} />
          <View style={styles.followingStatItem}>
            <Text style={styles.followingStatNumber}>18</Text>
            <Text style={styles.followingStatLabel}>Followers</Text>
          </View>
        </View>

        {/* Finish Profile Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTitle}>Finish your profile!</Text>
              <Text style={styles.bannerSubtitle}>Add a custom avatar.</Text>
              <TouchableOpacity 
                style={styles.bannerButton} 
                onPress={() => router.push('/customize-username')}
              >
                <Text style={styles.bannerButtonText}>COMPLETE PROFILE</Text>
              </TouchableOpacity>
            </View>
            <DuoBird size={70} animate={false} style={styles.bannerBird} />
          </View>
        </View>

        {/* Action Buttons Container */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.addFriendsButton} 
            onPress={() => router.push('/add-friends')}
          >
            <Text style={styles.addFriendsEmoji}>🫂</Text>
            <Text style={styles.addFriendsText}>ADD FRIENDS</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Stats (DSA Specific) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>STATISTICS</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>🔥</Text>
              </View>
              <View>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>⚡</Text>
              </View>
              <View>
                <Text style={styles.statValue}>1,250</Text>
                <Text style={styles.statLabel}>Total XP</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>💯</Text>
              </View>
              <View>
                <Text style={styles.statValue}>32</Text>
                <Text style={styles.statLabel}>Problems Solved</Text>
              </View>
            </View>
            <View style={styles.statBox}>
              <View style={styles.statIconContainer}>
                <Text style={styles.statEmoji}>🏆</Text>
              </View>
              <View>
                <Text style={styles.statValue}>Silver</Text>
                <Text style={styles.statLabel}>Current League</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
            <Text style={styles.viewAllText}>View All</Text>
          </View>
          
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Text style={styles.achievementEmoji}>🌲</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Tree Hugger</Text>
              <Text style={styles.achievementDesc}>Master all Tree data structures.</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '40%' }]} />
                </View>
                <Text style={styles.progressText}>Level 2</Text>
              </View>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Text style={styles.achievementEmoji}>🚀</Text>
            </View>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>Speed Demon</Text>
              <Text style={styles.achievementDesc}>Solve an algorithm in O(1) time.</Text>
              <View style={styles.progressRow}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: '100%', backgroundColor: AppColors.gold }]} />
                </View>
                <Text style={[styles.progressText, { color: AppColors.gold }]}>Max</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarEmoji: {
    fontSize: 64,
    lineHeight: 80,
    textAlign: 'center',
    width: 90,
    height: 90,
    backgroundColor: AppColors.bgCard,
    borderRadius: 45,
    overflow: 'hidden',
  },
  dashedBorder: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AppColors.border,
    borderStyle: 'dashed',
  },
  userName: {
    color: AppColors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userHandle: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  joinDate: {
    color: AppColors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  followingStats: {
    flexDirection: 'row',
    backgroundColor: AppColors.bgCard,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  followingStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  followingDivider: {
    width: 1,
    backgroundColor: AppColors.border,
  },
  followingStatNumber: {
    color: AppColors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  followingStatLabel: {
    color: AppColors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  bannerContainer: {
    backgroundColor: AppColors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  bannerTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(0,0,0,0.7)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: AppColors.primaryDark,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bannerBird: {
    marginRight: -10,
    marginBottom: -20,
  },
  actionSection: {
    marginBottom: 32,
  },
  addFriendsButton: {
    backgroundColor: AppColors.blue,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderBottomWidth: 4,
    borderBottomColor: AppColors.blueDark,
  },
  addFriendsEmoji: {
    fontSize: 20,
  },
  addFriendsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  viewAllText: {
    color: AppColors.info,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statBox: {
    width: (width - 52) / 2,
    backgroundColor: AppColors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AppColors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statEmoji: {
    fontSize: 16,
  },
  statValue: {
    color: AppColors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: AppColors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  achievementCard: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
  },
  achievementIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: AppColors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: AppColors.border,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  achievementDesc: {
    color: AppColors.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: AppColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
  },
  progressText: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
