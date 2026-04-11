import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { AppColors } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const CARDS = [
  { id: 1, topic: 'Arrays', question: 'What is the time complexity of accessing an element by index in an Array?', answer: 'O(1) Constant Time' },
  { id: 2, topic: 'Linked Lists', question: 'Unlike arrays, Linked Lists do NOT require...', answer: 'Contiguous memory allocation' },
  { id: 3, topic: 'Trees', question: 'In a Binary Search Tree, where are smaller elements placed relative to the root?', answer: 'To the Left' },
  { id: 4, topic: 'Stacks', question: 'What principle does a Stack follow?', answer: 'LIFO (Last In, First Out)' },
  { id: 5, topic: 'Big O', question: 'Which is faster for large inputs: O(N log N) or O(N²)?', answer: 'O(N log N)' },
];

export default function FlashcardsScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Initialize swipe capability
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          // Swipe Right (Got it)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.spring(position, {
            toValue: { x: width + 100, y: gestureState.dy },
            useNativeDriver: true,
          }).start(() => forceNextCard());
        } else if (gestureState.dx < -120) {
          // Swipe Left (Don't Know)
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Animated.spring(position, {
            toValue: { x: -width - 100, y: gestureState.dy },
            useNativeDriver: true,
          }).start(() => forceNextCard());
        } else {
          // Spring back to center
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    // Animate the next card scaling up when it becomes active
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);

  const forceNextCard = () => {
    setCurrentIndex(prev => prev + 1);
    position.setValue({ x: 0, y: 0 });
    scale.setValue(0.9);
    setFlipped(false);
    flipAnim.setValue(0);
  };

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });
  const rotateInterpolate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const getCardStyle = () => {
    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate: rotateInterpolate },
        { scale: scale },
      ],
    };
  };

  if (currentIndex >= CARDS.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.doneContainer}>
          <Text style={styles.doneEmoji}>🎉</Text>
          <Text style={styles.doneTitle}>Practice Complete!</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>BACK TO HOME</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
        <View style={styles.progressBg}>
          <Animated.View style={[styles.progressFill, { width: `${(currentIndex / CARDS.length) * 100}%` }]} />
        </View>
      </View>

      <View style={styles.cardsContainer}>
        {/* Render Next Card (Background) */}
        {currentIndex + 1 < CARDS.length && (
          <View style={[styles.card, styles.nextCard, { transform: [{ scale: 0.95 }] }]}>
            <Text style={styles.topicBadge}>{CARDS[currentIndex + 1].topic}</Text>
          </View>
        )}

        {/* Render Active Card (Foreground) */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[styles.cardContainer, getCardStyle()]}
        >
          <TouchableOpacity activeOpacity={1} onPress={handleCardPress} style={styles.cardTouchArea}>
            
            {/* FRONT OF CARD */}
            <Animated.View style={[styles.card, styles.cardFace, { transform: [{ rotateY: frontInterpolate }] }]}>
              <View style={styles.badgeContainer}>
                <Text style={styles.topicBadge}>{CARDS[currentIndex].topic}</Text>
              </View>
              <Text style={styles.questionText}>{CARDS[currentIndex].question}</Text>
              <Text style={styles.tapToFlip}>Tap to flip 🔄</Text>
            </Animated.View>

            {/* BACK OF CARD */}
            <Animated.View style={[styles.card, styles.cardFace, styles.cardBack, { transform: [{ rotateY: backInterpolate }] }]}>
              <View style={styles.badgeContainer}>
                <Text style={styles.topicBadge}>{CARDS[currentIndex].topic}</Text>
              </View>
              <Text style={styles.answerText}>{CARDS[currentIndex].answer}</Text>
            </Animated.View>

          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Swipe Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionLeft}>👈  Needs Review</Text>
        <Text style={styles.instructionRight}>Got It!  👉</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
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
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    position: 'absolute',
    width: width - 40,
    height: height * 0.55,
    zIndex: 100,
  },
  cardTouchArea: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: AppColors.bgCard,
    borderWidth: 2,
    borderColor: AppColors.borderLight,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    position: 'absolute',
    backfaceVisibility: 'hidden',
  },
  nextCard: {
    position: 'absolute',
    zIndex: 1,
    opacity: 0.7,
  },
  cardFace: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: AppColors.primaryDark,
    borderColor: AppColors.primary,
  },
  badgeContainer: {
    position: 'absolute',
    top: 24,
    left: 24,
  },
  topicBadge: {
    backgroundColor: AppColors.bgElevated,
    color: AppColors.textSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  questionText: {
    color: AppColors.textPrimary,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 36,
  },
  answerText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 44,
  },
  tapToFlip: {
    position: 'absolute',
    bottom: 24,
    color: AppColors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  instructionLeft: {
    color: AppColors.red,
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionRight: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  doneEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  doneTitle: {
    color: AppColors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderBottomWidth: 4,
    borderBottomColor: AppColors.primaryDark,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
