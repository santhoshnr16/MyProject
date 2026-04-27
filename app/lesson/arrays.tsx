import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ArraysLesson from '../../components/ArraysLesson';
import { AppColors } from '../../constants/theme';

export default function ArraysLessonScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ArraysLesson />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
});
