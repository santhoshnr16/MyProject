import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
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
      <View style={styles.content}>
        {/* Owl/Mascot */}
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
            {/* Owl body */}
            <View style={styles.owlBody}>
              {/* Owl belly */}
              <View style={styles.owlBelly} />
              
              {/* Eyes */}
              <View style={styles.eyesContainer}>
                <View style={styles.eye}>
                  <View style={styles.pupil} />
                  <View style={styles.eyeShine} />
                </View>
                <View style={styles.eye}>
                  <View style={styles.pupil} />
                  <View style={styles.eyeShine} />
                </View>
              </View>
              
              {/* Beak */}
              <View style={styles.beak} />
              
              {/* Wings */}
              <View style={[styles.wing, styles.leftWing]} />
              <View style={[styles.wing, styles.rightWing]} />
              
              {/* Feet */}
              <View style={styles.feetContainer}>
                <View style={styles.foot} />
                <View style={styles.foot} />
              </View>
            </View>
            
            {/* Stars above head */}
            <View style={styles.starsContainer}>
              <Text style={styles.star}>+</Text>
              <Text style={styles.star}>+</Text>
              <Text style={styles.star}>+</Text>
            </View>
          </Animated.View>
        </View>

        {/* Welcome message */}
        <Text style={styles.welcomeText}>Welcome back, Santhosh!</Text>
        <Text style={styles.subtitleText}>Ready to master data structures today?</Text>

        {/* Stats section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>7</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>125</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
        </View>

        {/* Progress section */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Daily Goal</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressText}>5/10 XP</Text>
        </View>
      </View>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/(tabs)/data-structures')}
        >
          <Text style={styles.startButtonText}>START LESSON</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.reviewButton}>
          <Text style={styles.reviewButtonText}>PRACTICE REVIEW</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#58CC02',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  owlContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  owlBody: {
    width: 120,
    height: 120,
    backgroundColor: '#58CC02',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#58A700',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  owlBelly: {
    position: 'absolute',
    bottom: 15,
    width: 80,
    height: 60,
    backgroundColor: '#89E219',
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  eyesContainer: {
    position: 'absolute',
    top: 25,
    flexDirection: 'row',
    gap: 20,
  },
  eye: {
    width: 28,
    height: 28,
    backgroundColor: '#fff',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#58A700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  pupil: {
    width: 14,
    height: 14,
    backgroundColor: '#000',
    borderRadius: 7,
    position: 'absolute',
  },
  eyeShine: {
    position: 'absolute',
    top: 3,
    right: 5,
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  beak: {
    position: 'absolute',
    top: 58,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF9600',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  wing: {
    position: 'absolute',
    width: 30,
    height: 45,
    backgroundColor: '#58A700',
    borderRadius: 15,
    top: 45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  leftWing: {
    left: -12,
    transform: [{ rotate: '-15deg' }],
  },
  rightWing: {
    right: -12,
    transform: [{ rotate: '15deg' }],
  },
  feetContainer: {
    position: 'absolute',
    bottom: -8,
    flexDirection: 'row',
    gap: 25,
  },
  foot: {
    width: 12,
    height: 8,
    backgroundColor: '#FF9600',
    borderRadius: 6,
  },
  starsContainer: {
    position: 'absolute',
    top: -30,
    flexDirection: 'row',
    gap: 12,
  },
  star: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 20,
    marginHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    gap: 12,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#58CC02',
  },
  reviewButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
