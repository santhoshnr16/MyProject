import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../constants/theme';

export default function QuestScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header Board */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.monthTitle}>April Quests</Text>
            <Text style={styles.daysCount}>22 DAYS LEFT</Text>
          </View>
          <View style={styles.characterContainer}>
            <Text style={styles.characterEmoji}>🏆</Text>
          </View>
        </View>

        {/* Monthly Progress */}
        <View style={styles.questSection}>
          <Text style={styles.sectionTitle}>MONTHLY CHALLENGE</Text>
          <View style={styles.questCard}>
            <View style={styles.questInfoRow}>
              <View style={styles.questIconContainer}>
                <Text style={styles.questIconEmoji}>🥇</Text>
              </View>
              <View style={styles.questTextContainer}>
                <Text style={styles.questTitle}>Earn 30 Quest Badges</Text>
                
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '40%' }]} />
                  </View>
                  <Text style={styles.progressText}>12/30</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Quests */}
        <View style={styles.questSection}>
          <Text style={styles.sectionTitle}>DAILY QUESTS</Text>
          
          {/* Array Quest */}
          <View style={styles.questCard}>
            <View style={styles.questInfoRow}>
              <View style={styles.questIconContainer}>
                <Text style={styles.questIconEmoji}>📦</Text>
              </View>
              <View style={styles.questTextContainer}>
                <Text style={styles.questTitle}>Solve 3 Array problems</Text>
                
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '66%', backgroundColor: AppColors.blue }]} />
                  </View>
                  <Text style={styles.progressText}>2/3</Text>
                </View>
              </View>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardEmoji}>🎁</Text>
              </View>
            </View>
          </View>

          {/* Lesson Quest */}
          <View style={styles.questCard}>
            <View style={styles.questInfoRow}>
              <View style={styles.questIconContainer}>
                <Text style={styles.questIconEmoji}>📚</Text>
              </View>
              <View style={styles.questTextContainer}>
                <Text style={styles.questTitle}>Complete 2 lessons</Text>
                
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '50%', backgroundColor: AppColors.orange }]} />
                  </View>
                  <Text style={styles.progressText}>1/2</Text>
                </View>
              </View>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardEmoji}>💎</Text>
              </View>
            </View>
          </View>

          {/* Accuracy Quest */}
          <View style={styles.questCard}>
            <View style={styles.questInfoRow}>
              <View style={styles.questIconContainer}>
                <Text style={styles.questIconEmoji}>🎯</Text>
              </View>
              <View style={styles.questTextContainer}>
                <Text style={styles.questTitle}>Score 90% in practice</Text>
                
                <View style={styles.progressRow}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '0%', backgroundColor: AppColors.purple }]} />
                  </View>
                  <Text style={styles.progressText}>0/1</Text>
                </View>
              </View>
              <View style={styles.rewardContainer}>
                <Text style={styles.rewardEmoji}>🎁</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Friends Quest */}
        <View style={styles.questSection}>
          <Text style={styles.sectionTitle}>FRIEND QUESTS</Text>
          
          <View style={[styles.questCard, { borderColor: AppColors.purple }]}>
            <View style={styles.questInfoRow}>
              <View style={[styles.questIconContainer, { backgroundColor: AppColors.purple + '20' }]}>
                <Text style={styles.questIconEmoji}>👥</Text>
              </View>
              <View style={styles.questTextContainer}>
                <Text style={styles.questTitle}>Follow your first friend</Text>
                <Text style={styles.questSubtitle}>Programming is better together!</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>FIND FRIENDS</Text>
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
    backgroundColor: AppColors.bg,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: AppColors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  headerTop: {
    marginBottom: 10,
    zIndex: 2,
  },
  monthTitle: {
    color: '#0D1117',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  daysCount: {
    color: 'rgba(13,17,23,0.7)',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  characterContainer: {
    position: 'absolute',
    right: 20,
    top: 15,
    backgroundColor: '#fff',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(13,17,23,0.1)',
  },
  characterEmoji: {
    fontSize: 32,
  },
  questSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 16,
  },
  questCard: {
    backgroundColor: AppColors.bgCard,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  questInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.border,
    marginRight: 16,
  },
  questIconEmoji: {
    fontSize: 24,
  },
  questTextContainer: {
    flex: 1,
  },
  questTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  questSubtitle: {
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
    borderRadius: 4,
  },
  progressText: {
    color: AppColors.textSecondary,
    fontSize: 14,
    fontWeight: 'bold',
    width: 45,
    textAlign: 'right',
  },
  rewardContainer: {
    width: 48,
    height: 48,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.bgElevated,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  rewardEmoji: {
    fontSize: 24,
  },
  actionButton: {
    backgroundColor: AppColors.purple,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    borderBottomWidth: 4,
    borderBottomColor: AppColors.purpleDark,
  },
  actionButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
