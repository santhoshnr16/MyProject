import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../constants/theme';

interface Topic {
  id: string;
  icon: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonsCount: number;
  progress: number;
}

const TOPICS: Topic[] = [
  { id: '1', icon: '📦', title: 'Arrays & Strings', difficulty: 'Beginner', lessonsCount: 8, progress: 100 },
  { id: '2', icon: '🔗', title: 'Linked Lists', difficulty: 'Beginner', lessonsCount: 5, progress: 60 },
  { id: '3', icon: '📚', title: 'Stacks & Queues', difficulty: 'Beginner', lessonsCount: 6, progress: 0 },
  { id: '4', icon: '🌳', title: 'Trees', difficulty: 'Intermediate', lessonsCount: 10, progress: 0 },
  { id: '5', icon: '🔍', title: 'Searching & Sorting', difficulty: 'Intermediate', lessonsCount: 7, progress: 0 },
  { id: '6', icon: '🗺️', title: 'Graphs', difficulty: 'Advanced', lessonsCount: 12, progress: 0 },
  { id: '7', icon: '🗄️', title: 'Hash Tables', difficulty: 'Intermediate', lessonsCount: 4, progress: 0 },
  { id: '8', icon: '⚡', title: 'Dynamic Programming', difficulty: 'Advanced', lessonsCount: 15, progress: 0 },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTopics = TOPICS.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (diff: string) => {
    switch(diff) {
      case 'Beginner': return AppColors.primary;
      case 'Intermediate': return AppColors.orange;
      case 'Advanced': return AppColors.red;
      default: return AppColors.textMuted;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Topics</Text>
        <Text style={styles.headerSubtitle}>Discover Data Structures & Algorithms</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search topics (e.g. Trees)..."
          placeholderTextColor={AppColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Text style={styles.searchIcon}>🔍</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredTopics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicCard} activeOpacity={0.8}>
            <View style={styles.topicHeader}>
              <View style={styles.topicIconContainer}>
                <Text style={styles.topicIcon}>{topic.icon}</Text>
              </View>
              <View style={styles.topicInfo}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <View style={styles.topicMeta}>
                  <View style={[styles.badge, { backgroundColor: getDifficultyColor(topic.difficulty) + '20' }]}>
                    <Text style={[styles.badgeText, { color: getDifficultyColor(topic.difficulty) }]}>
                      {topic.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.metaText}>{topic.lessonsCount} lessons</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Mastery</Text>
                <Text style={styles.progressValue}>{topic.progress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${topic.progress}%`, backgroundColor: topic.progress === 100 ? AppColors.gold : AppColors.primary }
                  ]} 
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
        {filteredTopics.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🙈</Text>
            <Text style={styles.emptyText}>No topics found matching "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: AppColors.bgInput,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 14,
    color: AppColors.textPrimary,
    fontSize: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    fontSize: 18,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  topicCard: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  topicIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: AppColors.bgElevated,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  topicIcon: {
    fontSize: 24,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginBottom: 6,
  },
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  metaText: {
    fontSize: 12,
    color: AppColors.textMuted,
    fontWeight: '500',
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: AppColors.textSecondary,
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 12,
    color: AppColors.textPrimary,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: AppColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: AppColors.textSecondary,
    fontSize: 16,
  },
});
