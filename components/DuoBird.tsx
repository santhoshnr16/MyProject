import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Path,
  Defs,
  RadialGradient,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';


interface DuoBirdProps {
  size?: number;
  style?: any;
  animate?: boolean;
}

export default function DuoBird({ size = 120, style, animate = true }: DuoBirdProps) {
  // Wing flap animation
  const wingFlap = useSharedValue(0);
  // Body bob animation
  const bodyBob = useSharedValue(0);
  // Tail wag
  const tailWag = useSharedValue(0);

  useEffect(() => {
    if (animate) {
      // Wing flapping - fast and realistic
      wingFlap.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 250, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) }),
        ),
        -1,
        false,
      );

      // Body gentle bob
      bodyBob.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );

      // Tail wag
      tailWag.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.sin) }),
          withTiming(-1, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    }
  }, [animate]);


  // We'll use the Animated API from RN for the outer transforms since
  // reanimated SVG animated props can be tricky
  const bodyStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(bodyBob.value, [0, 1], [0, -4]) },
      ],
    };
  });

  const leftWingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(wingFlap.value, [0, 1], [10, -45])}deg` },
      ],
    };
  });

  const rightWingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(wingFlap.value, [0, 1], [-10, 45])}deg` },
      ],
    };
  });

  const tailStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(tailWag.value, [-1, 1], [-8, 8])}deg` },
      ],
    };
  });

  const w = size;
  const h = size * 1.2;
  const scale = size / 280;

  return (
    <View style={[{ width: w, height: h }, style]}>
      {/* Body with bob animation */}
      <Animated.View style={[{ width: w, height: h }, bodyStyle]}>
        
        {/* Left Wing - animated flapping */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: -size * 0.14,
              top: size * 0.25,
              width: size * 0.45,
              height: size * 0.5,
              transformOrigin: 'right center',
            },
            leftWingStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 120">
            <Defs>
              <LinearGradient id="lwGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <Stop offset="0%" stopColor="#4DB800" />
                <Stop offset="100%" stopColor="#3D9400" />
              </LinearGradient>
            </Defs>
            {/* Main wing shape */}
            <Path
              d="M 90 60 Q 75 20, 45 8 Q 25 2, 12 15 Q 2 30, 8 50 Q 12 65, 30 75 Q 50 85, 80 80 Z"
              fill="url(#lwGrad)"
            />
            {/* Wing feather lines */}
            <Path d="M 80 65 Q 55 30, 25 15" stroke="#5EC400" strokeWidth="2" fill="none" opacity="0.5" />
            <Path d="M 75 72 Q 50 45, 18 30" stroke="#5EC400" strokeWidth="1.5" fill="none" opacity="0.35" />
            <Path d="M 70 78 Q 45 55, 15 42" stroke="#5EC400" strokeWidth="1" fill="none" opacity="0.25" />
            {/* Wing tip feathers */}
            <Path d="M 12 15 Q 5 10, 8 5 Q 12 8, 18 12" fill="#3D9400" opacity="0.7" />
            <Path d="M 20 10 Q 15 3, 20 0 Q 22 5, 24 10" fill="#3D9400" opacity="0.5" />
          </Svg>
        </Animated.View>

        {/* Right Wing - animated flapping */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: -size * 0.14,
              top: size * 0.25,
              width: size * 0.45,
              height: size * 0.5,
              transformOrigin: 'left center',
            },
            rightWingStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 100 120">
            <Defs>
              <LinearGradient id="rwGrad" x1="100%" y1="0%" x2="0%" y2="80%">
                <Stop offset="0%" stopColor="#4DB800" />
                <Stop offset="100%" stopColor="#3D9400" />
              </LinearGradient>
            </Defs>
            <Path
              d="M 10 60 Q 25 20, 55 8 Q 75 2, 88 15 Q 98 30, 92 50 Q 88 65, 70 75 Q 50 85, 20 80 Z"
              fill="url(#rwGrad)"
            />
            <Path d="M 20 65 Q 45 30, 75 15" stroke="#5EC400" strokeWidth="2" fill="none" opacity="0.5" />
            <Path d="M 25 72 Q 50 45, 82 30" stroke="#5EC400" strokeWidth="1.5" fill="none" opacity="0.35" />
            <Path d="M 30 78 Q 55 55, 85 42" stroke="#5EC400" strokeWidth="1" fill="none" opacity="0.25" />
            <Path d="M 88 15 Q 95 10, 92 5 Q 88 8, 82 12" fill="#3D9400" opacity="0.7" />
            <Path d="M 80 10 Q 85 3, 80 0 Q 78 5, 76 10" fill="#3D9400" opacity="0.5" />
          </Svg>
        </Animated.View>

        {/* Tail feathers - animated wag */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: size * 0.3,
              bottom: size * 0.02,
              width: size * 0.4,
              height: size * 0.25,
              transformOrigin: 'center top',
            },
            tailStyle,
          ]}>
          <Svg width="100%" height="100%" viewBox="0 0 90 55">
            <Path d="M 30 0 Q 15 25, 5 50 Q 25 40, 35 15 Z" fill="#3D9400" />
            <Path d="M 45 0 Q 42 30, 40 50 Q 50 35, 48 10 Z" fill="#46A302" />
            <Path d="M 60 0 Q 75 25, 85 50 Q 65 40, 55 15 Z" fill="#3D9400" />
          </Svg>
        </Animated.View>

        {/* Main Bird Body SVG */}
        <Svg width={w} height={h} viewBox="0 0 280 336">
          <Defs>
            <RadialGradient id="bodyGrad" cx="50%" cy="40%" r="50%">
              <Stop offset="0%" stopColor="#78E308" />
              <Stop offset="60%" stopColor="#58CC02" />
              <Stop offset="100%" stopColor="#46A302" />
            </RadialGradient>
            <RadialGradient id="bellyGrad" cx="50%" cy="30%" r="55%">
              <Stop offset="0%" stopColor="#B5F060" />
              <Stop offset="50%" stopColor="#A0E830" />
              <Stop offset="100%" stopColor="#89E219" />
            </RadialGradient>
            <RadialGradient id="headGrad" cx="50%" cy="45%" r="50%">
              <Stop offset="0%" stopColor="#7AE510" />
              <Stop offset="100%" stopColor="#58CC02" />
            </RadialGradient>
            <LinearGradient id="beakTopGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#FFB830" />
              <Stop offset="100%" stopColor="#FF9500" />
            </LinearGradient>
            <LinearGradient id="beakBotGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#FF8C00" />
              <Stop offset="100%" stopColor="#E07000" />
            </LinearGradient>
            <LinearGradient id="legGrad" x1="50%" y1="0%" x2="50%" y2="100%">
              <Stop offset="0%" stopColor="#FFAA00" />
              <Stop offset="100%" stopColor="#E08A00" />
            </LinearGradient>
            <RadialGradient id="eyeWhiteGrad" cx="45%" cy="42%" r="50%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="100%" stopColor="#F0F0F0" />
            </RadialGradient>
          </Defs>

          {/* ========== SHADOW ========== */}
          <Ellipse cx="140" cy="320" rx="65" ry="10" fill="#000" opacity="0.08" />

          {/* ========== LEGS & FEET ========== */}
          {/* Left leg */}
          <Path d="M 115 260 L 108 285" stroke="url(#legGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Left foot toes */}
          <Path d="M 108 285 Q 95 290, 88 295" stroke="url(#legGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Path d="M 108 285 Q 103 293, 98 300" stroke="url(#legGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Path d="M 108 285 Q 112 293, 115 298" stroke="url(#legGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* Right leg */}
          <Path d="M 165 260 L 172 285" stroke="url(#legGrad)" strokeWidth="7" strokeLinecap="round" fill="none" />
          {/* Right foot toes */}
          <Path d="M 172 285 Q 185 290, 192 295" stroke="url(#legGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Path d="M 172 285 Q 177 293, 182 300" stroke="url(#legGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <Path d="M 172 285 Q 168 293, 165 298" stroke="url(#legGrad)" strokeWidth="5" strokeLinecap="round" fill="none" />

          {/* ========== BODY ========== */}
          <Ellipse cx="140" cy="195" rx="75" ry="80" fill="url(#bodyGrad)" />
          {/* Body sheen */}
          <Path
            d="M 80 165 Q 100 140, 135 138"
            stroke="#9AF030"
            strokeWidth="3"
            fill="none"
            opacity="0.35"
            strokeLinecap="round"
          />

          {/* ========== BELLY ========== */}
          <Ellipse cx="140" cy="215" rx="50" ry="50" fill="url(#bellyGrad)" />
          {/* Belly highlight */}
          <Ellipse cx="135" cy="200" rx="28" ry="22" fill="#C6F580" opacity="0.3" />

          {/* ========== HEAD ========== */}
          <Circle cx="140" cy="105" r="65" fill="url(#headGrad)" />
          {/* Head highlight */}
          <Path
            d="M 90 80 Q 110 55, 145 52"
            stroke="#9AF030"
            strokeWidth="3"
            fill="none"
            opacity="0.3"
            strokeLinecap="round"
          />

          {/* ========== HEAD CREST / FEATHER TUFTS ========== */}
          <Path d="M 125 45 Q 118 20, 115 8 Q 120 18, 128 38" fill="#58CC02" />
          <Path d="M 140 42 Q 140 12, 138 0 Q 145 15, 143 38" fill="#5ED400" />
          <Path d="M 155 45 Q 162 20, 165 8 Q 160 18, 152 38" fill="#58CC02" />
          {/* Extra small tufts */}
          <Path d="M 133 43 Q 128 28, 125 18 Q 130 26, 135 40" fill="#50C000" opacity="0.6" />
          <Path d="M 147 43 Q 152 28, 155 18 Q 150 26, 145 40" fill="#50C000" opacity="0.6" />

          {/* ========== EYES ========== */}
          {/* Eye whites - large expressive eyes */}
          <Ellipse cx="112" cy="105" rx="25" ry="27" fill="url(#eyeWhiteGrad)" />
          <Ellipse cx="168" cy="105" rx="25" ry="27" fill="url(#eyeWhiteGrad)" />
          {/* Eye outlines */}
          <Ellipse cx="112" cy="105" rx="25" ry="27" fill="none" stroke="#46A302" strokeWidth="2" opacity="0.3" />
          <Ellipse cx="168" cy="105" rx="25" ry="27" fill="none" stroke="#46A302" strokeWidth="2" opacity="0.3" />

          {/* Irises */}
          <Circle cx="116" cy="108" r="14" fill="#2D1B00" />
          <Circle cx="172" cy="108" r="14" fill="#2D1B00" />
          {/* Inner iris detail */}
          <Circle cx="116" cy="109" r="10" fill="#1A0F00" />
          <Circle cx="172" cy="109" r="10" fill="#1A0F00" />

          {/* Eye shine - primary */}
          <Circle cx="108" cy="99" r="6" fill="#FFFFFF" opacity="0.95" />
          <Circle cx="164" cy="99" r="6" fill="#FFFFFF" opacity="0.95" />
          {/* Eye shine - secondary */}
          <Circle cx="121" cy="114" r="3" fill="#FFFFFF" opacity="0.55" />
          <Circle cx="177" cy="114" r="3" fill="#FFFFFF" opacity="0.55" />

          {/* ========== EYEBROWS ========== */}
          <Path
            d="M 82 82 Q 95 68, 118 78"
            stroke="#3D9400"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M 198 82 Q 185 68, 162 78"
            stroke="#3D9400"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* ========== BEAK ========== */}
          {/* Upper beak */}
          <Path
            d="M 118 130 Q 125 120, 140 118 Q 155 120, 162 130 Q 155 135, 140 136 Q 125 135, 118 130 Z"
            fill="url(#beakTopGrad)"
          />
          {/* Beak shine */}
          <Path
            d="M 125 124 Q 132 120, 140 119"
            stroke="#FFD060"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
            strokeLinecap="round"
          />
          {/* Lower beak */}
          <Path
            d="M 122 132 Q 130 144, 140 147 Q 150 144, 158 132 Q 150 136, 140 137 Q 130 136, 122 132 Z"
            fill="url(#beakBotGrad)"
          />
          {/* Beak nostril dots */}
          <Circle cx="132" cy="127" r="1.5" fill="#E07000" opacity="0.5" />
          <Circle cx="148" cy="127" r="1.5" fill="#E07000" opacity="0.5" />

          {/* ========== CHEEKS ========== */}
          <Ellipse cx="78" cy="125" rx="12" ry="8" fill="#FF9EAA" opacity="0.2" />
          <Ellipse cx="202" cy="125" rx="12" ry="8" fill="#FF9EAA" opacity="0.2" />

          {/* ========== CHEST FEATHER TEXTURE ========== */}
          <Path d="M 115 185 Q 120 180, 125 185" stroke="#A0E830" strokeWidth="1.5" fill="none" opacity="0.3" />
          <Path d="M 135 178 Q 140 173, 145 178" stroke="#A0E830" strokeWidth="1.5" fill="none" opacity="0.3" />
          <Path d="M 155 185 Q 160 180, 165 185" stroke="#A0E830" strokeWidth="1.5" fill="none" opacity="0.3" />
          <Path d="M 125 200 Q 130 195, 135 200" stroke="#C6F580" strokeWidth="1" fill="none" opacity="0.25" />
          <Path d="M 145 200 Q 150 195, 155 200" stroke="#C6F580" strokeWidth="1" fill="none" opacity="0.25" />
        </Svg>
      </Animated.View>
    </View>
  );
}
