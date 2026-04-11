import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DuoBird from './DuoBird';

const { width, height } = Dimensions.get('window');

interface BirdTransitionProps {
  visible: boolean;
  onAnimationComplete: () => void;
}

export default function BirdTransition({ visible, onAnimationComplete }: BirdTransitionProps) {
  const birdX = useRef(new Animated.Value(-150)).current;
  const birdY = useRef(new Animated.Value(height * 0.5)).current;
  const birdScale = useRef(new Animated.Value(0.3)).current;
  const birdRotate = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.5)).current;

  // Trail particles
  const particle1Opacity = useRef(new Animated.Value(0)).current;
  const particle2Opacity = useRef(new Animated.Value(0)).current;
  const particle3Opacity = useRef(new Animated.Value(0)).current;
  const particle1X = useRef(new Animated.Value(0)).current;
  const particle2X = useRef(new Animated.Value(0)).current;
  const particle3X = useRef(new Animated.Value(0)).current;
  const particle1Y = useRef(new Animated.Value(0)).current;
  const particle2Y = useRef(new Animated.Value(0)).current;
  const particle3Y = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    if (visible) {
      // Reset all values
      birdX.setValue(-150);
      birdY.setValue(height * 0.5);
      birdScale.setValue(0.3);
      birdRotate.setValue(0);
      overlayOpacity.setValue(0);
      flashOpacity.setValue(0);
      textOpacity.setValue(0);
      textScale.setValue(0.5);



      // Phase 1: Bird enters from left, flies across with a swooping arc
      const enterAnimation = Animated.parallel([
        // Overlay fades in
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Bird flies from left to center with arc
        Animated.timing(birdX, {
          toValue: width * 0.35,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Bird swoops up during entry
        Animated.timing(birdY, {
          toValue: height * 0.35,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Bird scales up
        Animated.timing(birdScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        // Tilt during flight
        Animated.sequence([
          Animated.timing(birdRotate, {
            toValue: -15,
            duration: 400,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(birdRotate, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]);

      // Phase 2: Bird hovers at center with text
      const hoverAnimation = Animated.parallel([
        // Show "Let's Go!" text
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(textScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        // Small hover bounce
        Animated.sequence([
          Animated.timing(birdY, {
            toValue: height * 0.33,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(birdY, {
            toValue: height * 0.36,
            duration: 300,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      ]);

      // Phase 3: Bird flies off to the right
      const exitAnimation = Animated.parallel([
        // Bird exits right
        Animated.timing(birdX, {
          toValue: width + 150,
          duration: 600,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        // Bird goes up while exiting
        Animated.timing(birdY, {
          toValue: height * 0.15,
          duration: 600,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        // Bird tilts forward while flying away
        Animated.timing(birdRotate, {
          toValue: 15,
          duration: 600,
          useNativeDriver: true,
        }),
        // Scale down slightly
        Animated.timing(birdScale, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        // Hide text
        Animated.timing(textOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);

      // Phase 4: Flash and transition
      const flashAnimation = Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      // Sparkle trail particles animation
      const trailAnimation = Animated.parallel([
        // Particle 1
        Animated.sequence([
          Animated.delay(200),
          Animated.parallel([
            Animated.timing(particle1Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(particle1X, { toValue: width * 0.2, duration: 400, useNativeDriver: true }),
            Animated.timing(particle1Y, { toValue: height * 0.45, duration: 400, useNativeDriver: true }),
          ]),
          Animated.timing(particle1Opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        // Particle 2
        Animated.sequence([
          Animated.delay(400),
          Animated.parallel([
            Animated.timing(particle2Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(particle2X, { toValue: width * 0.15, duration: 400, useNativeDriver: true }),
            Animated.timing(particle2Y, { toValue: height * 0.42, duration: 400, useNativeDriver: true }),
          ]),
          Animated.timing(particle2Opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        // Particle 3
        Animated.sequence([
          Animated.delay(500),
          Animated.parallel([
            Animated.timing(particle3Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.timing(particle3X, { toValue: width * 0.25, duration: 400, useNativeDriver: true }),
            Animated.timing(particle3Y, { toValue: height * 0.4, duration: 400, useNativeDriver: true }),
          ]),
          Animated.timing(particle3Opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
      ]);

      // Run the full sequence
      Animated.parallel([
        Animated.sequence([
          enterAnimation,
          hoverAnimation,
          Animated.delay(200),
          exitAnimation,
          flashAnimation,
        ]),
        trailAnimation,
      ]).start(() => {
        onAnimationComplete();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const rotateInterpolate = birdRotate.interpolate({
    inputRange: [-15, 0, 15],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Dark overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />

      {/* Sparkle trail particles */}
      <Animated.View
        style={[
          styles.sparkleParticle,
          {
            opacity: particle1Opacity,
            transform: [{ translateX: particle1X }, { translateY: particle1Y }],
          },
        ]}>
        <Text style={styles.sparkleText}>✨</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleParticle,
          {
            opacity: particle2Opacity,
            transform: [{ translateX: particle2X }, { translateY: particle2Y }],
          },
        ]}>
        <Text style={styles.sparkleText}>⭐</Text>
      </Animated.View>
      <Animated.View
        style={[
          styles.sparkleParticle,
          {
            opacity: particle3Opacity,
            transform: [{ translateX: particle3X }, { translateY: particle3Y }],
          },
        ]}>
        <Text style={styles.sparkleText}>💫</Text>
      </Animated.View>

      {/* Flying Bird (SVG) */}
      <Animated.View
        style={[
          styles.birdContainer,
          {
            transform: [
              { translateX: birdX },
              { translateY: birdY },
              { scale: birdScale },
              { rotate: rotateInterpolate },
            ],
          },
        ]}>
        <DuoBird size={150} />
      </Animated.View>

      {/* "Let's Go!" Text */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [{ scale: textScale }],
          },
        ]}>
        <Text style={styles.goText}>Let's Go!</Text>
        <Text style={styles.subGoText}>Starting your lesson...</Text>
      </Animated.View>

      {/* Flash overlay for transition */}
      <Animated.View style={[styles.flashOverlay, { opacity: flashOpacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(19, 31, 36, 0.85)',
  },
  birdContainer: {
    position: 'absolute',
    width: 150,
    height: 175,
  },
  textContainer: {
    position: 'absolute',
    bottom: height * 0.3,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  goText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#58CC02',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  subGoText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 8,
    opacity: 0.8,
    letterSpacing: 1,
  },
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#58CC02',
  },
  sparkleParticle: {
    position: 'absolute',
  },
  sparkleText: {
    fontSize: 24,
  },
});
