import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import TreeVisualizer from '../../components/TreeVisualizer';
import { AppColors } from '../../constants/theme';

export default function TreesLessonScreen() {
  const router = useRouter();

  const completeLesson = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
             <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
          <View style={styles.progressBg}>
             <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
        </View>

        {/* Lesson Content */}
        <View style={styles.lessonTextContainer}>
            <Text style={styles.lessonOverline}>NEW CONCEPT</Text>
            <Text style={styles.lessonTitle}>Tree Traversals</Text>
            <Text style={styles.lessonDescription}>
              Trees are non-linear data structures. To search them, we use <Text style={{fontWeight: 'bold', color: AppColors.purple}}>Depth-First Search (DFS)</Text> which dives deep into branches, or <Text style={{fontWeight: 'bold', color: AppColors.blue}}>Breadth-First Search (BFS)</Text> which explores level-by-level using a Queue.
            </Text>
        </View>

        {/* Visualizer Widget */}
        <View style={styles.visualizerWrapper}>
            <TreeVisualizer />
        </View>

        <View style={styles.bottomSection}>
             <TouchableOpacity style={styles.primaryButton} onPress={completeLesson} activeOpacity={0.8}>
                <Text style={styles.primaryButtonText}>COMPLETE LESSON</Text>
             </TouchableOpacity>
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
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AppColors.bgElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: AppColors.textSecondary,
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: -2,
  },
  progressBg: {
    flex: 1,
    height: 12,
    backgroundColor: AppColors.bgElevated,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
  },
  lessonTextContainer: {
      marginBottom: 30,
  },
  lessonOverline: {
      color: AppColors.purple,
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 1,
      marginBottom: 8,
  },
  lessonTitle: {
      color: AppColors.textPrimary,
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 16,
  },
  lessonDescription: {
      color: AppColors.textSecondary,
      fontSize: 18,
      lineHeight: 28,
  },
  visualizerWrapper: {
      marginBottom: 40,
  },
  bottomSection: {
      flex: 1,
      justifyContent: 'flex-end',
      marginTop: 20,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: AppColors.primaryDark,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
