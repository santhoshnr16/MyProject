import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BirdTransition from '../../components/BirdTransition';
import DuoBird from '../../components/DuoBird';
import { AppColors } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const [showBird, setShowBird] = useState(false);
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create continuous bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    // Create subtle rotation animation
    const rotateAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );

    bounceAnimation.start();
    rotateAnimation.start();
  }, []);

  const bounceInterpolate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-5deg', '5deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header Stats */}
        <View style={styles.headerStatsRow}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatIcon}>🔥</Text>
            <Text style={[styles.headerStatText, { color: AppColors.orange }]}>7</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatIcon}>💎</Text>
            <Text style={[styles.headerStatText, { color: AppColors.blue }]}>125</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatIcon}>⚡</Text>
            <Text style={[styles.headerStatText, { color: AppColors.purple }]}>3</Text>
          </View>
        </View>

        {/* Duo Bird Mascot */}
        <View style={styles.mascotContainer}>
          <Animated.View
            style={[
              styles.owlContainer,
              {
                transform: [
                  { translateY: bounceInterpolate },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}>
            <DuoBird size={140} />
          </Animated.View>
        </View>

        {/* Welcome message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userNameText}>Santhosh!</Text>
        </View>

        {/* Continue Learning Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardOverline}>CONTINUE LEARNING</Text>
            <Text style={styles.cardProgressText}>Lesson 4/8</Text>
          </View>
          <Text style={styles.cardTitle}>Data Structures: Trees</Text>
          <Text style={styles.cardSubtitle}>Master binary search trees and traversals.</Text>

          <View style={styles.cardProgressContainer}>
            <View style={styles.cardProgressBar}>
              <View style={[styles.cardProgressFill, { width: '50%' }]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowBird(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>RESUME LESSON</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: AppColors.bgElevated, borderColor: AppColors.blue }]} 
            activeOpacity={0.8}
            onPress={() => router.push('/flashcards')}
          >
            <Text style={styles.actionCardEmoji}>🎯</Text>
            <Text style={styles.actionCardTitle}>Quick Practice</Text>
            <Text style={styles.actionCardSubtitle}>+5 XP</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: AppColors.bgElevated, borderColor: AppColors.orange }]} activeOpacity={0.8}>
            <Text style={styles.actionCardEmoji}>🏆</Text>
            <Text style={styles.actionCardTitle}>Daily Challenge</Text>
            <Text style={styles.actionCardSubtitle}>New</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />

      </ScrollView>

      {/* Bird Flying Animation Overlay */}
      <BirdTransition
        visible={showBird}
        onAnimationComplete={() => {
          setShowBird(false);
          router.push('/(tabs)/data-structures');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  headerStatIcon: {
    fontSize: 16,
  },
  headerStatText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mascotContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  owlContainer: {
    alignItems: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 20,
    color: AppColors.textSecondary,
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.textPrimary,
    marginTop: 4,
  },
  card: {
    backgroundColor: AppColors.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AppColors.borderLight,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardOverline: {
    color: AppColors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardProgressText: {
    color: AppColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    color: AppColors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  cardProgressContainer: {
    marginBottom: 24,
  },
  cardProgressBar: {
    height: 8,
    backgroundColor: AppColors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardProgressFill: {
    height: '100%',
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: AppColors.primaryDark,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionCardEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  actionCardTitle: {
    color: AppColors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionCardSubtitle: {
    color: AppColors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});
